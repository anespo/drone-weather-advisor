import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DroneSpecsCard = () => {
  const specifications = [
    {
      icon: 'leaf',
      label: 'Max Wind Speed',
      value: '10 m/s (36 km/h)',
    },
    {
      icon: 'thermometer',
      label: 'Operating Temp',
      value: '-10°C to 40°C',
    },
    {
      icon: 'trending-up',
      label: 'Max Altitude',
      value: '4000m',
    },
    {
      icon: 'shield-checkmark',
      label: 'Water Resistance',
      value: 'None',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#667eea" />
        <Text style={styles.title}>DJI Neo 2 Specifications</Text>
      </View>

      <View style={styles.specsGrid}>
        {specifications.map((spec, index) => (
          <View key={index} style={styles.specItem}>
            <Ionicons name={spec.icon} size={24} color="#667eea" />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
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
  specsGrid: {
    gap: 15,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  specContent: {
    marginLeft: 15,
    flex: 1,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default DroneSpecsCard;