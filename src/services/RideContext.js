import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';
import { caloriesEstimate, climbSplit, metersToKm, mpsToKph } from '../utils/metrics';
import { distanceMeters } from '../utils/geo';
import { loadRides, saveRides } from './storage';

const RideContext = createContext(null);

const createBaseStats = () => ({
  speedKph: 0,
  gpsSpeedKph: 0,
  accelSpeedKph: 0,
  topSpeedKph: 0,
  distanceKm: 0,
  durationSec: 0,
  battery: 100,
  drops: 0,
  gpsAccuracyM: null,
  cadenceLikeMotion: 0
});

export const RideProvider = ({ children }) => {
  const [isTracking, setTracking] = useState(false);
  const [ridePoints, setRidePoints] = useState([]);
  const [stats, setStats] = useState(createBaseStats);
  const [rides, setRides] = useState([]);
  const [hasPermission, setHasPermission] = useState(true);
  const locationSub = useRef(null);
  const accelSub = useRef(null);
  const timer = useRef(null);
  const altitudes = useRef([]);
  const lastCoordRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const fusedSpeedRef = useRef(0);
  const accelMagnitudeEmaRef = useRef(0);

  useEffect(() => {
    loadRides().then(setRides);
  }, []);

  const stopTracking = useCallback(async () => {
    setTracking(false);
    locationSub.current?.remove();
    accelSub.current?.remove();
    if (timer.current) clearInterval(timer.current);

    if (ridePoints.length > 1) {
      const avgKph = stats.durationSec ? stats.distanceKm / (stats.durationSec / 3600) : 0;
      const ride = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        points: ridePoints,
        ...stats,
        avgSpeedKph: Number(avgKph.toFixed(1)),
        calories: caloriesEstimate({ durationSec: stats.durationSec, avgKph }),
        ...climbSplit(altitudes.current)
      };
      const next = [ride, ...rides];
      setRides(next);
      await saveRides(next);
    }
  }, [ridePoints, rides, stats]);

  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setHasPermission(false);
      return;
    }

    setHasPermission(true);
    setRidePoints([]);
    altitudes.current = [];
    lastCoordRef.current = null;
    lastTimestampRef.current = null;
    fusedSpeedRef.current = 0;
    accelMagnitudeEmaRef.current = 0;
    setStats(createBaseStats());
    setTracking(true);

    const battery = await Battery.getBatteryLevelAsync();
    setStats((s) => ({ ...s, battery: Math.round(battery * 100) }));

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 800,
        distanceInterval: 1,
        mayShowUserSettingsDialog: true
      },
      (loc) => {
        const now = loc.timestamp || Date.now();
        const coord = loc.coords;
        const gpsAccuracyM = typeof coord.accuracy === 'number' ? coord.accuracy : null;
        const gpsSpeedKph = mpsToKph(Math.max(coord.speed || 0, 0));

        altitudes.current.push(coord.altitude || 0);
        setRidePoints((prev) => [...prev, coord]);

        const lastCoord = lastCoordRef.current;
        const lastTime = lastTimestampRef.current;
        let accelSpeedKph = 0;
        let segmentMeters = 0;

        if (lastCoord && lastTime) {
          segmentMeters = distanceMeters(lastCoord, coord);
          const dt = Math.max((now - lastTime) / 1000, 0.25);
          accelSpeedKph = mpsToKph(segmentMeters / dt);
        }

        lastCoordRef.current = coord;
        lastTimestampRef.current = now;

        const qualityWeight = gpsAccuracyM === null ? 0.65 : gpsAccuracyM <= 8 ? 0.8 : gpsAccuracyM <= 15 ? 0.65 : 0.45;
        const blended = gpsSpeedKph * qualityWeight + accelSpeedKph * (1 - qualityWeight);
        fusedSpeedRef.current = fusedSpeedRef.current === 0 ? blended : fusedSpeedRef.current * 0.7 + blended * 0.3;

        setStats((prev) => {
          const distanceKm = prev.distanceKm + metersToKm(segmentMeters);
          return {
            ...prev,
            gpsAccuracyM,
            gpsSpeedKph: Number(gpsSpeedKph.toFixed(1)),
            accelSpeedKph: Number(accelSpeedKph.toFixed(1)),
            speedKph: Number(Math.max(fusedSpeedRef.current, 0).toFixed(1)),
            topSpeedKph: Number(Math.max(prev.topSpeedKph, fusedSpeedRef.current).toFixed(1)),
            distanceKm: Number(distanceKm.toFixed(3))
          };
        });
      }
    );

    accelSub.current = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      accelMagnitudeEmaRef.current = accelMagnitudeEmaRef.current === 0 ? magnitude : accelMagnitudeEmaRef.current * 0.85 + magnitude * 0.15;
      const jerk = Math.abs(magnitude - accelMagnitudeEmaRef.current);
      setStats((s) => ({
        ...s,
        drops: jerk > 0.9 ? s.drops + 1 : s.drops,
        cadenceLikeMotion: Number((s.cadenceLikeMotion * 0.9 + magnitude * 0.1).toFixed(2))
      }));
    });

    Accelerometer.setUpdateInterval(100);

    timer.current = setInterval(() => {
      setStats((s) => ({ ...s, durationSec: s.durationSec + 1 }));
    }, 1000);
  }, []);

  const summary = useMemo(
    () => ({ isTracking, ridePoints, stats, rides, hasPermission, startTracking, stopTracking }),
    [isTracking, ridePoints, stats, rides, hasPermission, startTracking, stopTracking]
  );

  return <RideContext.Provider value={summary}>{children}</RideContext.Provider>;
};

export const useRide = () => useContext(RideContext);
