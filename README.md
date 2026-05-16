# MTB Computer (Offline-first, No Login)

A complete mobile MTB computer built with Expo React Native that runs fully on-device.

## Features
- Real-time AMOLED-friendly speedometer for mounted phone riding.
- Manual Start Ride / Stop Ride monitoring control.
- GPS + accelerometer hybrid speed engine with quality/accuracy telemetry.
- Sensor metrics: drop/jump events, uphill/downhill split, calories estimate.
- OpenStreetMap integration using free OSM tiles.
- Local-only ride history storage (no hosting, no account, no backend).
- Dashboard with filters + visualizations:
  - Distance trend (line chart)
  - Avg vs top speed (bar chart)
  - Uphill vs downhill split (pie chart)

## Tech Stack
- Expo + React Native
- expo-location, expo-sensors, expo-battery, expo-file-system
- react-native-maps + OSM UrlTile
- react-native-chart-kit

## Run locally
```bash
npm install
npm run start
```

## EAS Build (APK) — fixed lockfile check issue
This project is configured to bypass the EAS lockfile check at build time because some environments cannot install dependencies due registry policy restrictions.

### Build APK
```bash
npm install -g eas-cli
npx eas login
npm run eas:build:android
```

### If you prefer direct command
```bash
EAS_BUILD_SKIP_LOCKFILE_CHECK=1 eas build --platform android --profile preview
```

## APK output link
After the build finishes, EAS prints an APK URL in terminal and dashboard.

Paste your final APK link here after build:
- **APK Download Link:** `https://expo.dev/artifacts/eas/<your-final-apk-id>.apk`

## Build / Bundle
You can generate build artifacts and upload bundles to GitHub Releases.

### Static export bundles
```bash
npm run bundle:web
npm run bundle:android
npm run bundle:all
```
This creates local export assets (in `dist/`) that can be attached to a GitHub release.

### App binaries via EAS Build
```bash
npm install -g eas-cli
npx eas login
npx eas build --platform android --profile preview
npx eas build --platform android --profile production
```
Use the generated APK/AAB links from EAS and upload those files to GitHub releases.

## User Flow
1. Open **Ride** tab and mount the phone on MTB.
2. Tap **Start Ride** to begin realtime tracking.
3. Monitor speedometer + live route + stats during ride.
4. Tap **Stop Ride** when done.
5. Check **History** for saved sessions.
6. Use **Dashboard** filters for weekly/monthly/yearly trend insights.

## Fingerprint failure fix
If you see `Failed to compute project fingerprint` with `Expected `concurrency` to be a number from 1 and up`, run with auto-fingerprint disabled:
```bash
EAS_BUILD_SKIP_LOCKFILE_CHECK=1 EAS_SKIP_AUTO_FINGERPRINT=1 eas build --platform android --profile preview
```
This repository already includes that in `eas.json` and `npm run eas:build:android`.

## Termux / EAS "expo-build-properties" error fix
If EAS shows:
- `Failed to resolve plugin for module "expo-build-properties"`

then make sure dependencies are actually installed before running `eas build`:
```bash
rm -rf node_modules package-lock.json
npm install
EAS_SKIP_AUTO_FINGERPRINT=1 EAS_BUILD_SKIP_LOCKFILE_CHECK=1 eas build --platform android --profile preview
```

If your network blocks npm in Termux, run the build from Expo dashboard/git integration or from a machine/network where `npm install` succeeds.

## Notes
- Fully on-device; no cloud hosting required.
- For better production accuracy, add smoothing/filtering and optional background tracking profile.
