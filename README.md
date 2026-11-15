# GClock

A transparent home-screen clock widget for Android and iOS. The eyes are awake during the local midnight hour (00:00 through 00:59).

## Requirements

- Node.js 22.13 or newer
- Android Studio and an Android emulator or device for local Android builds
- macOS with Xcode 26.4 or newer for local iOS builds

Expo Go does not include widget support. Build and run the native development app instead.

## Install and run

```sh
npm install
npm run android
```

On macOS, use `npm run ios` for the iOS simulator. On Windows, iOS builds require a Mac or a cloud build service.

After installing the app, add the GClock widget from the phone's home-screen widget picker. The iOS widget uses system time text and schedules eye changes at midnight and 01:00. Android snapshots refresh while the app is open; the system may delay widget updates while it is closed.