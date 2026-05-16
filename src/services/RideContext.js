import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';
import { caloriesEstimate, climbSplit, metersToKm, mpsToKph } from '../utils/metrics';
import { distanceMeters } from '../utils/geo';
import { loadRides, saveRides } from './storage';

const RideContext = createContext(null);

export const RideProvider = ({ children }) => {
  const [isTracking, setTracking] = useState(false);
  const [ridePoints, setRidePoints] = useState([]);
  const [stats, setStats] = useState({ speedKph: 0, topSpeedKph: 0, distanceKm: 0, durationSec: 0, battery: 100, drops: 0 });
  const [rides, setRides] = useState([]);
  const locationSub = useRef(null);
  const accelSub = useRef(null);
  const timer = useRef(null);
  const altitudes = useRef([]);

  useEffect(() => { loadRides().then(setRides); }, []);

  const stopTracking = useCallback(async () => {
    setTracking(false);
    locationSub.current?.remove();
    accelSub.current?.remove();
    if (timer.current) clearInterval(timer.current);

    if (ridePoints.length > 1) {
      const avgKph = stats.durationSec ? (stats.distanceKm / (stats.durationSec / 3600)) : 0;
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
    if (status !== 'granted') return;
    setRidePoints([]);
    altitudes.current = [];
    setStats({ speedKph: 0, topSpeedKph: 0, distanceKm: 0, durationSec: 0, battery: 100, drops: 0 });
    setTracking(true);

    const battery = await Battery.getBatteryLevelAsync();
    setStats((s) => ({ ...s, battery: Math.round(battery * 100) }));

    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
      (loc) => {
        const speed = mpsToKph(Math.max(loc.coords.speed || 0, 0));
        altitudes.current.push(loc.coords.altitude || 0);
        setRidePoints((prev) => [...prev, loc.coords]);
        setStats((prev) => {
          const last = ridePoints[ridePoints.length - 1];
          const segment = last ? distanceMeters(last, loc.coords) : 0;
          return {
            ...prev,
            speedKph: Number(speed.toFixed(1)),
            topSpeedKph: Number(Math.max(prev.topSpeedKph, speed).toFixed(1)),
            distanceKm: Number((prev.distanceKm + metersToKm(segment)).toFixed(3))
          };
        });
      }
    );

    accelSub.current = Accelerometer.addListener(({ z }) => {
      if (Math.abs(z) > 1.8) setStats((s) => ({ ...s, drops: s.drops + 1 }));
    });
    Accelerometer.setUpdateInterval(300);

    timer.current = setInterval(() => {
      setStats((s) => ({ ...s, durationSec: s.durationSec + 1 }));
    }, 1000);
  }, [ridePoints]);

  const summary = useMemo(() => ({ isTracking, ridePoints, stats, rides, startTracking, stopTracking }), [isTracking, ridePoints, stats, rides, startTracking, stopTracking]);
  return <RideContext.Provider value={summary}>{children}</RideContext.Provider>;
};

export const useRide = () => useContext(RideContext);
