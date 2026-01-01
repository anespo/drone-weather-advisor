import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeatherService from '../services/WeatherService';

const FlightStatusCard = ({ flightAnalysis }) => {
  if (!flightAnalysis) return null;

  const getStatusText = (status) => {
    const statusTexts = {
      excellent: 'Perfect Flying',
      good: 'Good Conditions',
      caution: 'Fly with Caution',
      danger: 'Do Not Fly'
    };
    return statusTexts[status] || 'Unknown';
  };

  const getConditionIcon = (type) => {
    const icons = {
      wind: 'leaf',
      temperature: 'thermometer',
      precipitation: 'rainy',
      visibility: 'eye'
    };
    return icons[type] || 'information-circle';
  };

  const statusColor = WeatherService.getStatusColor(flightAnalysis.overallStatus);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="airplane" size={24} color="#667eea" />
          <Text style={styles.title}>Flight Status</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>
            {getStatusText(flightAnalysis.overallStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.conditionsContainer}>
        {flightAnalysis.conditions.map((condition, index) => (
          <View key={index} style={styles.conditionItem}>
            <View style={[
              styles.conditionIcon,
              { backgroundColor: WeatherService.getStatusColor(condition.status) + '20' }
            ]}>
              <Ionicons
                name={getConditionIcon(condition.type)}
                size={20}
                color={WeatherService.getStatusColor(condition.status)}
              />
            </View>
            <Text style={styles.conditionMessage}>{condition.message}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  conditionsContainer: {
    gap: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  conditionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  conditionMessage: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default FlightStatusCard;