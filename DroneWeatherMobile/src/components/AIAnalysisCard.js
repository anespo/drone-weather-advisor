import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeatherService from '../services/WeatherService';

const AIAnalysisCard = ({ weatherData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weatherData) {
      fetchAIAnalysis();
    }
  }, [weatherData]);

  const fetchAIAnalysis = async () => {
    try {
      setLoading(true);
      const aiAnalysis = await WeatherService.getAIAnalysis(weatherData);
      setAnalysis(aiAnalysis);
    } catch (error) {
      console.error('AI Analysis error:', error);
      // Fallback to basic analysis
      setAnalysis(WeatherService.getBasicAnalysis(weatherData));
    } finally {
      setLoading(false);
    }
  };

  if (!weatherData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb" size={24} color="#667eea" />
        <Text style={styles.title}>AI Weather Analysis</Text>
        {weatherData.demoMode && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoText}>DEMO</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#667eea" />
          <Text style={styles.loadingText}>Analyzing conditions...</Text>
        </View>
      ) : (
        <View style={styles.analysisContent}>
          {analysis?.summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>AI Weather Analysis</Text>
              <Text style={styles.summaryText}>{analysis.summary}</Text>
              {analysis.confidence && (
                <Text style={styles.confidenceText}>{analysis.confidence}</Text>
              )}
            </View>
          )}
          
          {analysis?.recommendation && (
            <View style={styles.recommendationContainer}>
              <View style={styles.recommendationHeader}>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.recommendationTitle}>Flight Recommendation</Text>
              </View>
              <Text style={styles.recommendationText}>{analysis.recommendation}</Text>
            </View>
          )}

          {weatherData.demoMode && (
            <View style={styles.demoNotice}>
              <Ionicons name="information-circle" size={16} color="#667eea" />
              <Text style={styles.demoNoticeText}>
                Demo mode active. Connect to real API for Gemini AI analysis.
              </Text>
            </View>
          )}
        </View>
      )}
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
    flex: 1,
  },
  demoBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  demoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  analysisContent: {
    gap: 15,
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  confidenceText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  recommendationContainer: {
    backgroundColor: 'linear-gradient(45deg, #667eea, #764ba2)',
    borderRadius: 10,
    padding: 15,
    // For React Native, we'll use a solid color instead of gradient
    backgroundColor: '#667eea',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    fontWeight: '500',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  demoNoticeText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 8,
    flex: 1,
  },
});

export default AIAnalysisCard;