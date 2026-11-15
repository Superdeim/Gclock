# GClock project notes

- This is an Expo SDK 58 app with native Android and iOS home-screen widgets.
- Keep widget backgrounds transparent and base the midnight-eye window on device-local time from 00:00 up to 01:00.
- Widget components run in isolated runtimes and must use Expo UI components without hooks or external module state.
- iOS clock text and eye transitions use WidgetKit timelines; Android snapshots refresh while the app is active.