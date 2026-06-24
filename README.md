# FoodBridge (Expo SDK 54 rebuild)

A clean Expo Go-friendly rebuild of FoodBridge with:
- Expo Router tabs
- local demo mode via AsyncStorage
- optional Appwrite backend integration
- Google Maps handoff from addresses
- posting, ratings, and reports

## Why this rebuild
This package.json is aligned to Expo SDK 54 for Expo Go testing on a physical device. Expo recommends SDK 54 for Expo Go during the SDK 55 transition, and SDK 54 pairs with React Native 0.81 / React 19.1.0. Appwrite's React Native quickstart for Expo also uses `react-native-appwrite` with `react-native-url-polyfill`.

## Install
```bash
npm install
npm run start
```

If Expo Go hangs on LAN, try:
```bash
npx expo start --tunnel --clear
```

## Appwrite setup (optional)
1. Copy `.env.example` to `.env`
2. Fill your Appwrite values
3. Restart Expo

If `.env` is empty, the app runs in local demo mode.

## Recommended test order
1. Open the app in Expo Go
2. Browse Home / Meals / Free Food / Profile
3. Create a listing
4. Open a listing and submit a rating + report
5. Tap the address button to open Google Maps
6. Only then wire Appwrite IDs into `.env`
