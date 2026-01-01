#!/bin/bash

echo "🚁 Starting Drone Weather Advisor Mobile App..."
echo ""
echo "📱 Instructions for iPhone:"
echo "1. Make sure Expo Go is installed on your iPhone"
echo "2. Make sure your iPhone and computer are on the same WiFi network"
echo "3. When the QR code appears, use your iPhone Camera app to scan it"
echo "4. Tap the notification to open in Expo Go"
echo ""
echo "Starting Expo development server..."
echo ""

# Kill any existing processes on port 8081
lsof -ti:8081 | xargs kill -9 2>/dev/null

# Start Expo
npx expo start --port 8081