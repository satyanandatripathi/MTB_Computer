import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, UrlTile } from 'react-native-maps';
import { Button, Text } from 'react-native-paper';
import MetricCard from '../components/MetricCard';
import { useRide } from '../services/RideContext';

export default function RideScreen() {
  const { isTracking, startTracking, stopTracking, ridePoints, stats } = useRide();
  return (
    <View style={styles.container}>
      <Text style={styles.speed}>{stats.speedKph.toFixed(1)}</Text>
      <Text style={styles.unit}>km/h</Text>
      <View style={styles.row}><MetricCard title="Distance" value={`${stats.distanceKm} km`} /><MetricCard title="Top Speed" value={`${stats.topSpeedKph} km/h`} /></View>
      <View style={styles.row}><MetricCard title="Time" value={`${Math.floor(stats.durationSec / 60)} min`} /><MetricCard title="Drops" value={`${stats.drops}`} /></View>
      <MapView style={styles.map}>
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {!!ridePoints.length && <Polyline coordinates={ridePoints} strokeColor="#00E676" strokeWidth={4} />}
      </MapView>
      <Button mode="contained" buttonColor={isTracking ? '#ff1744' : '#00E676'} onPress={isTracking ? stopTracking : startTracking}>
        {isTracking ? 'Stop Ride' : 'Start Ride'}
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#000', padding: 12, paddingTop: 32 }, speed: { color: '#00E676', fontSize: 82, textAlign: 'center', fontWeight: '800' }, unit: { color: '#fff', textAlign: 'center', marginBottom: 8 }, row: { flexDirection: 'row' }, map: { flex: 1, borderRadius: 16, overflow: 'hidden', marginVertical: 10 } });
