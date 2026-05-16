import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, UrlTile } from 'react-native-maps';
import { Button, Text } from 'react-native-paper';
import MetricCard from '../components/MetricCard';
import { useRide } from '../services/RideContext';

export default function RideScreen() {
  const { isTracking, startTracking, stopTracking, ridePoints, stats, hasPermission } = useRide();
  const latestPoint = ridePoints[ridePoints.length - 1];

  return (
    <View style={styles.container}>
      {!hasPermission && <Text style={styles.warn}>Location permission is required for real sensor tracking.</Text>}
      <Text style={styles.speed}>{stats.speedKph.toFixed(1)}</Text>
      <Text style={styles.unit}>km/h (Hybrid)</Text>
      <View style={styles.row}>
        <MetricCard title="Distance" value={`${stats.distanceKm} km`} />
        <MetricCard title="Top Speed" value={`${stats.topSpeedKph} km/h`} />
      </View>
      <View style={styles.row}>
        <MetricCard title="GPS Speed" value={`${stats.gpsSpeedKph} km/h`} />
        <MetricCard title="Sensor Speed" value={`${stats.accelSpeedKph} km/h`} />
      </View>
      <View style={styles.row}>
        <MetricCard title="GPS Accuracy" value={stats.gpsAccuracyM ? `${stats.gpsAccuracyM.toFixed(1)} m` : '—'} />
        <MetricCard title="Drops" value={`${stats.drops}`} />
      </View>
      <View style={styles.row}>
        <MetricCard title="Time" value={`${Math.floor(stats.durationSec / 60)} min`} />
        <MetricCard title="Motion Index" value={`${stats.cadenceLikeMotion}`} />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        region={latestPoint ? { latitude: latestPoint.latitude, longitude: latestPoint.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 } : undefined}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {!!ridePoints.length && <Polyline coordinates={ridePoints} strokeColor="#00E676" strokeWidth={4} />}
      </MapView>
      <Button mode="contained" buttonColor={isTracking ? '#ff1744' : '#00E676'} onPress={isTracking ? stopTracking : startTracking}>
        {isTracking ? 'Stop Ride' : 'Start Ride'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 12, paddingTop: 28 },
  warn: { color: '#ff8a80', marginBottom: 4, textAlign: 'center' },
  speed: { color: '#00E676', fontSize: 72, textAlign: 'center', fontWeight: '800' },
  unit: { color: '#fff', textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row' },
  map: { flex: 1, borderRadius: 16, overflow: 'hidden', marginVertical: 10 }
});
