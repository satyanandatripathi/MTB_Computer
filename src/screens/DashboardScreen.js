import { useMemo, useState } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { useRide } from '../services/RideContext';

const width = Dimensions.get('window').width - 18;

export default function DashboardScreen() {
  const { rides } = useRide();
  const [range, setRange] = useState('weekly');
  const filtered = useMemo(() => rides.slice(0, range === 'weekly' ? 7 : range === 'monthly' ? 30 : range === 'yearly' ? 365 : rides.length), [range, rides]);
  const totalDistance = filtered.reduce((a, r) => a + r.distanceKm, 0).toFixed(1);
  const totalCalories = filtered.reduce((a, r) => a + (r.calories || 0), 0);
  const chartConfig = { backgroundGradientFrom: '#0a0a0a', backgroundGradientTo: '#0a0a0a', color: (o = 1) => `rgba(0,230,118,${o})`, labelColor: () => '#aaa' };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 10 }}>
      <SegmentedButtons value={range} onValueChange={setRange} buttons={[{ value: 'daily', label: 'All' }, { value: 'weekly', label: '7D' }, { value: 'monthly', label: '30D' }, { value: 'yearly', label: '1Y' }]} />
      <Text style={{ color: '#fff', marginTop: 8 }}>Total Distance: {totalDistance} km | Calories: {totalCalories}</Text>
      <LineChart data={{ labels: filtered.slice(0, 7).map((_, i) => `${i + 1}`), datasets: [{ data: filtered.slice(0, 7).map((r) => r.distanceKm || 0) || [0] }] }} width={width} height={220} chartConfig={chartConfig} bezier style={{ marginTop: 12 }} />
      <BarChart data={{ labels: ['Avg', 'Top'], datasets: [{ data: [filtered.reduce((a, r) => a + (r.avgSpeedKph || 0), 0) / (filtered.length || 1), Math.max(...filtered.map((r) => r.topSpeedKph || 0), 0)] }] }} width={width} height={220} chartConfig={chartConfig} style={{ marginTop: 12 }} />
      <PieChart
        data={[
          { name: 'Uphill', value: filtered.reduce((a, r) => a + (r.uphillMeters || 0), 0), color: '#00E676', legendFontColor: '#fff', legendFontSize: 12 },
          { name: 'Downhill', value: filtered.reduce((a, r) => a + (r.downhillMeters || 0), 0), color: '#2979ff', legendFontColor: '#fff', legendFontSize: 12 }
        ]}
        width={width}
        height={220}
        accessor="value"
        backgroundColor="transparent"
        chartConfig={chartConfig}
        paddingLeft="8"
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
