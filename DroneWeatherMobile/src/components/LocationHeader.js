import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationHeader = ({ locationName, onRefresh }) => {
  return (
    <View style={styles.container}>
      <View style={styles.locationInfo}>
        <Ionicons name="location" size={20} color="#667eea" />
        <Text style={styles.locationText}>{locationName}</Text>
      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Ionicons name="refresh" size={18} color="#667eea" />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 8,
    padding: 8,
  },
});

export default LocationHeader;