# Drone Weather Advisor - Mobile App

A React Native mobile application for drone pilots to check weather conditions specifically for DJI Neo 2 drone operations.

## Features

- **Real-time Weather Data**: Current conditions and forecasts
- **GPS Location**: Automatic location detection
- **Flight Safety Analysis**: DJI Neo 2 specific recommendations
- **Professional UI**: Native mobile experience
- **Cross-platform**: iOS and Android support
- **Offline Fallback**: Demo mode when server unavailable

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Your web server running on `http://localhost:3000`

## Installation

1. **Navigate to mobile app directory**:
   ```bash
   cd DroneWeatherMobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

## Running the App

### iOS Simulator
```bash
npx expo run:ios
```

### Android Emulator
```bash
npx expo run:android
```

### Web Browser (for testing)
```bash
npx expo start --web
```

### Physical Device
1. Install Expo Go app on your device
2. Scan the QR code from the terminal
3. The app will load on your device

## Project Structure

```
DroneWeatherMobile/
├── src/
│   ├── components/
│   │   ├── LocationHeader.js      # Location display and refresh
│   │   ├── FlightStatusCard.js    # Flight safety analysis
│   │   ├── CurrentWeatherCard.js  # Current weather metrics
│   │   ├── ForecastCard.js        # Hourly/daily forecasts
│   │   └── DroneSpecsCard.js      # DJI Neo 2 specifications
│   └── services/
│       └── WeatherService.js      # Weather API and analysis logic
├── App.js                         # Main application component
├── app.json                       # Expo configuration
└── package.json                   # Dependencies
```

## Configuration

### Server Connection
The app connects to your web server at `http://localhost:3000`. If you need to change this:

1. Edit `src/services/WeatherService.js`
2. Update the `API_BASE_URL` constant
3. For physical device testing, use your computer's IP address

### Location Permissions
The app requests location permissions to provide accurate weather data. Permissions are configured in `app.json`:

- **iOS**: `NSLocationWhenInUseUsageDescription`
- **Android**: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

## Features Overview

### 🌍 Location Services
- Automatic GPS location detection
- Fallback to Fuengirola, Málaga, Spain
- Manual location refresh

### 🚁 Flight Analysis
- Wind speed monitoring (DJI Neo 2 limit: 10 m/s)
- Temperature range validation (-10°C to 40°C)
- Weather condition assessment
- Overall flight recommendation

### 📱 Mobile Experience
- Native iOS/Android look and feel
- Pull-to-refresh functionality
- Smooth scrolling forecasts
- Professional gradient design
- Responsive layout

### 🔄 Data Management
- Real-time weather updates
- Demo mode fallback
- Error handling
- Loading states

## Building for Production

### iOS
1. **Configure signing**:
   ```bash
   npx expo build:ios
   ```

2. **Generate IPA**:
   ```bash
   npx eas build --platform ios
   ```

### Android
1. **Generate APK**:
   ```bash
   npx expo build:android
   ```

2. **Generate AAB**:
   ```bash
   npx eas build --platform android
   ```

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Ensure your web server is running on `http://localhost:3000`
   - For physical devices, update `API_BASE_URL` to your computer's IP
   - Check firewall settings

2. **Location not working**
   - Grant location permissions in device settings
   - App will fallback to Fuengirola coordinates

3. **App crashes on startup**
   - Clear Expo cache: `npx expo start --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips

- Use `npx expo start --tunnel` for testing on physical devices
- Enable remote debugging in Expo DevTools
- Check console logs for API errors
- Use demo mode for offline testing

## Next Steps

This completes **Step 2: iOS Mobile App Development**. The app is ready for:

1. **Testing on iOS devices**
2. **App Store submission** (requires Apple Developer account)
3. **Step 3: Android optimization** (already cross-platform compatible)

## Dependencies

- **React Native**: Mobile framework
- **Expo**: Development platform
- **expo-location**: GPS location services
- **expo-linear-gradient**: Gradient backgrounds
- **@expo/vector-icons**: Icon library
- **axios**: HTTP client

## License

MIT License - Same as the web application.