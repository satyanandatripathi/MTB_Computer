import React from 'react';
import { Card, Text } from 'react-native-paper';

export default function MetricCard({ title, value }) {
  return (
    <Card style={{ margin: 6, backgroundColor: '#111', flex: 1 }}>
      <Card.Content>
        <Text style={{ color: '#8f8f8f', fontSize: 12 }}>{title}</Text>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{value}</Text>
      </Card.Content>
    </Card>
  );
}
