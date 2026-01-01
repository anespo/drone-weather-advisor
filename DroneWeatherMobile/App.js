import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import WeatherService from './src/services/WeatherService';
import LocationHeader from './src/components/LocationHeader';
import FlightStatusCard from './src/components/FlightStatusCard';
import CurrentWeatherCard from './src/components/CurrentWeatherCard';
import AIAnalysisCard from './src/components/AIAnalysisCard';
import ForecastCard from './src/components/ForecastCard';
import DroneSpecsCard from './src/components/DroneSpecsCard';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('Getting location...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Use Fuengirola, Málaga, Spain as default
        const defaultLocation = {
          latitude: 36.54167,
          longitude: -4.62500,
        };
        setLocation(defaultLocation);
        setLocationName('Fuengirola, Málaga, Spain');
        await fetchWeatherData(defaultLocation);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      
      setLocation(coords);
      await getLocationName(coords);
      await fetchWeatherData(coords);
      
    } catch (error) {
      console.error('Location error:', error);
      // Fallback to Fuengirola
      const defaultLocation = {
        latitude: 36.54167,
        longitude: -4.62500,
      };
      setLocation(defaultLocation);
      setLocationName('Fuengirola, Málaga, Spain (Default)');
      await fetchWeatherData(defaultLocation);
    }
  };

  const getLocationName = async (coords) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        const name = `${location.city || location.district || 'Unknown'}, ${location.country || ''}`;
        setLocationName(name);
      }
    } catch (error) {
      setLocationName(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
    }
  };

  const fetchWeatherData = async (coords) => {
    try {
      setLoading(true);
      const data = await WeatherService.getWeatherData(coords.latitude, coords.longitude);
      setWeatherData(data);
      setDemoMode(data.demoMode || false);
    } catch (error) {
      console.error('Weather fetch error:', error);
      Alert.alert(
        'Weather Data Error',
        'Failed to fetch weather data. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchWeatherData(location);
    } else {
      await getCurrentLocation();
    }
    setRefreshing(false);
  };

  const handleLocationRefresh = async () => {
    await getCurrentLocation();
  };

  if (loading && !weatherData) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Ionicons name="airplane" size={60} color="white" />
          <Text style={styles.loadingText}>Loading Weather Data...</Text>
          <Text style={styles.loadingSubtext}>Analyzing flight conditions</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            colors={['#667eea']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Ionicons name="airplane" size={32} color="white" />
              <Text style={styles.headerTitle}>Drone Weather Advisor</Text>
            </View>
            <View style={styles.droneModel}>
              <Text style={styles.droneModelText}>DJI Neo 2</Text>
            </View>
          </View>
          
          {demoMode && (
            <View style={styles.demoNotice}>
              <Ionicons name="construct" size={16} color="#856404" />
              <Text style={styles.demoText}>Demo Mode - API Key Activating</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <LocationHeader
          locationName={locationName}
          onRefresh={handleLocationRefresh}
        />

        {/* Flight Status */}
        {weatherData && (
          <FlightStatusCard
            flightAnalysis={weatherData.flightAnalysis}
          />
        )}

        {/* Current Weather */}
        {weatherData && (
          <CurrentWeatherCard
            currentWeather={weatherData.current}
          />
        )}

        {/* AI Weather Analysis */}
        {weatherData && (
          <AIAnalysisCard
            weatherData={weatherData}
          />
        )}

        {/* Forecasts */}
        {weatherData && (
          <>
            <ForecastCard
              title="24-Hour Forecast"
              icon="time"
              data={weatherData.hourly?.slice(0, 12) || []}
              type="hourly"
            />
            
            <ForecastCard
              title="5-Day Forecast"
              icon="calendar"
              data={weatherData.daily?.slice(0, 5) || []}
              type="daily"
            />
          </>
        )}

        {/* Drone Specifications */}
        <DroneSpecsCard />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Drone Weather Advisor
          </Text>
          <Text style={styles.footerSubtext}>
            Weather data provided by OpenWeatherMap
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  droneModel: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  droneModelText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  demoNotice: {
    backgroundColor: 'rgba(255, 243, 205, 0.9)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoText: {
    color: '#856404',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  footerSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});