// Configuration for the Drone Weather Advisor mobile app

const config = {
  // API Configuration
  API_BASE_URL: 'http://localhost:3000/api', // Change this for production
  
  // Default location (Fuengirola, Málaga, Spain)
  DEFAULT_LOCATION: {
    latitude: 36.54167,
    longitude: -4.62500,
    name: 'Fuengirola, Málaga, Spain'
  },
  
  // DJI Neo 2 Specifications
  DRONE_SPECS: {
    maxWindSpeed: 10, // m/s
    maxOperatingTemp: 40, // °C
    minOperatingTemp: -10, // °C
    maxAltitude: 4000, // meters
    ipRating: 'None', // Not waterproof
    model: 'DJI Neo 2'
  },
  
  // App Configuration
  APP_CONFIG: {
    refreshInterval: 300000, // 5 minutes
    locationTimeout: 10000, // 10 seconds
    apiTimeout: 10000, // 10 seconds
  },
  
  // Colors
  COLORS: {
    primary: '#667eea',
    secondary: '#764ba2',
    excellent: '#28a745',
    good: '#17a2b8',
    caution: '#ffc107',
    danger: '#dc3545',
    background: 'rgba(255, 255, 255, 0.95)',
    text: '#333',
    textSecondary: '#666',
  }
};

export default config;