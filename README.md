# MTB Computer (Offline-first, No Login)

A complete mobile MTB computer built with Expo React Native that runs fully on-device.

## Features
- Real-time AMOLED-friendly speedometer for mounted phone riding.
- Manual Start Ride / Stop Ride monitoring control.
- GPS + accelerometer hybrid speed engine with quality/accuracy telemetry.
- Sensor metrics: drop/jump events, uphill/downhill split, calories estimate.
- OpenStreetMap integration using free OSM tiles.
- Local-only ride history storage (no hosting, no account, no backend).
- Dashboard with charts + filters.

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

## User Flow
1. Open **Ride** tab and mount the phone on MTB.
2. Tap **Start Ride** to begin realtime tracking.
3. Monitor speedometer + live route + stats.
4. Tap **Stop Ride** when done.
5. Check **History** and **Dashboard** for analysis.


### Fingerprint failure fix
If you see `Failed to compute project fingerprint` with `Expected `concurrency` to be a number from 1 and up`, run with auto-fingerprint disabled:
```bash
EAS_BUILD_SKIP_LOCKFILE_CHECK=1 EAS_SKIP_AUTO_FINGERPRINT=1 eas build --platform android --profile preview
```
This repository already includes that in `eas.json` and `npm run eas:build:android`.
