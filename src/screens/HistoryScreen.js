import { FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRide } from '../services/RideContext';

export default function HistoryScreen() {
  const { rides } = useRide();
  return (
    <FlatList
      style={{ backgroundColor: '#000' }}
      data={rides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={{ margin: 8, backgroundColor: '#111' }}>
          <Card.Content>
            <Text style={{ color: '#fff' }}>{new Date(item.date).toLocaleString()}</Text>
            <Text style={{ color: '#b5b5b5' }}>Distance: {item.distanceKm} km | Avg: {item.avgSpeedKph} km/h | Calories: {item.calories}</Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}
