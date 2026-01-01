import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CurrentWeatherCard = ({ currentWeather }) => {
  if (!currentWeather) return null;

  const weatherMetrics = [
    {
      icon: 'thermometer',
      value: `${Math.round(currentWeather.temp)}°C`,
      label: 'Temperature',
    },
    {
      icon: 'leaf',
      value: `${currentWeather.wind_speed} m/s`,
      label: 'Wind Speed',
    },
    {
      icon: 'eye',
      value: `${((currentWeather.visibility || 10000) / 1000).toFixed(1)} km`,
      label: 'Visibility',
    },
    {
      icon: 'water',
      value: `${currentWeather.humidity}%`,
      label: 'Humidity',
    },
    {
      icon: 'speedometer',
      value: `${currentWeather.pressure} hPa`,
      label: 'Pressure',
    },
    {
      icon: 'cloud',
      value: currentWeather.weather[0].main,
      label: 'Conditions',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="partly-sunny" size={24} color="#667eea" />
        <Text style={styles.title}>Current Conditions</Text>
      </View>

      <View style={styles.metricsGrid}>
        {weatherMetrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Ionicons name={metric.icon} size={32} color="#667eea" />
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CurrentWeatherCard;