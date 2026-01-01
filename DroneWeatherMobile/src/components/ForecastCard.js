import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeatherService from '../services/WeatherService';

const ForecastCard = ({ title, icon, data, type }) => {
  if (!data || data.length === 0) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (type === 'hourly') {
      return `${date.getHours()}:00`;
    } else {
      return date.toLocaleDateString('en', { weekday: 'short' });
    }
  };

  const getTemperature = (item) => {
    if (type === 'hourly') {
      return `${Math.round(item.temp)}°C`;
    } else {
      return `${Math.round(item.temp.max)}°/${Math.round(item.temp.min)}°`;
    }
  };

  const getWeatherIcon = (weatherMain) => {
    return WeatherService.getWeatherIcon(weatherMain);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={icon} size={24} color="#667eea" />
        <Text style={styles.title}>{title}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, index) => {
          const windColor = WeatherService.getWindStatusColor(item.wind_speed);
          
          return (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>
                {formatTime(item.dt)}
              </Text>
              
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getWeatherIcon(item.weather[0].main)}
                  size={32}
                  color="#667eea"
                />
              </View>
              
              <Text style={styles.forecastTemp}>
                {getTemperature(item)}
              </Text>
              
              <View style={styles.windContainer}>
                <Ionicons name="leaf" size={12} color={windColor} />
                <Text style={[styles.forecastWind, { color: windColor }]}>
                  {item.wind_speed.toFixed(1)} m/s
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  scrollContent: {
    paddingRight: 10,
  },
  forecastItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  forecastTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  iconContainer: {
    marginVertical: 8,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  windContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastWind: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ForecastCard;