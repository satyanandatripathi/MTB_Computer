import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RideScreen from './src/screens/RideScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { RideProvider } from './src/services/RideContext';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
    card: '#0f0f0f',
    text: '#fff',
    primary: '#00E676',
    border: '#1b1b1b'
  }
};

export default function App() {
  return (
    <PaperProvider>
      <RideProvider>
        <NavigationContainer theme={theme}>
          <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { backgroundColor: '#050505' },
            tabBarActiveTintColor: '#00E676',
            tabBarInactiveTintColor: '#8b8b8b',
            tabBarIcon: ({ color, size }) => {
              const icon = route.name === 'Ride' ? 'speedometer' : route.name === 'Dashboard' ? 'chart-donut' : 'map-clock';
              return <MaterialCommunityIcons name={icon} size={size} color={color} />;
            }
          })}>
            <Tab.Screen name="Ride" component={RideScreen} />
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </RideProvider>
    </PaperProvider>
  );
}
