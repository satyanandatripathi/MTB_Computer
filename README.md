# MTB Computer (Offline-first, No Login)

A complete mobile MTB computer built with Expo React Native that runs fully on-device.

## Features
- Real-time **full-screen AMOLED speedometer** for mounted phone riding.
- Manual **Start Ride / Stop Ride** control for monitoring sessions.
- Smartphone sensor-driven ride metrics:
  - GPS route + distance + current speed + top speed
  - Accelerometer-based drop/jump event count
  - Elevation-derived uphill/downhill trail split
  - Ride duration + calorie estimate
- OpenStreetMap integration using free OSM tile service.
- Local storage (no server required) for ride history.
- Dashboard analytics with:
  - Line chart (distance trend)
  - Bar chart (avg speed vs top speed)
  - Pie chart (uphill vs downhill split)
  - Daily/weekly/monthly/yearly-style filtering.

## Stack
- Expo + React Native
- `expo-location`, `expo-sensors`, `expo-file-system`
- `react-native-maps` + OSM UrlTile
- `react-native-chart-kit`
- React Navigation + React Native Paper

## Run
```bash
npm install
npm run start
```

Then run on Android/iOS via Expo (recommended for real sensor data).

## App Flow
1. Open **Ride** tab and mount phone on MTB.
2. Tap **Start Ride**.
3. Observe live speedometer + route + metrics.
4. Tap **Stop Ride** after ride.
5. View saved sessions in **History**.
6. Analyze trends in **Dashboard**.

## Notes
- No sign up, no hosting, no backend.
- Works fully on smartphone local storage.
- For production deployment, add background location mode and stronger smoothing/filtering logic.
