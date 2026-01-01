import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Your web server
const DJI_NEO2_LIMITS = {
  maxWindSpeed: 10, // m/s
  maxOperatingTemp: 40, // °C
  minOperatingTemp: -10, // °C
  maxAltitude: 4000, // meters
  ipRating: 'None' // Not waterproof
};

class WeatherService {
  static async getWeatherData(lat, lon) {
    try {
      // Try to connect to server first, fallback to demo data
      const response = await axios.get(`${API_BASE_URL}/weather/${lat}/${lon}`, {
        timeout: 5000,
      });
      
      return response.data;
    } catch (error) {
      console.log('Server not available, using demo data for mobile testing');
      return this.getDemoWeatherData();
    }
  }

  static async getAIAnalysis(weatherData) {
    try {
      // Try to connect to server first, fallback to basic analysis
      const response = await axios.post(`${API_BASE_URL}/analyze-weather`, {
        weatherData,
      }, {
        timeout: 5000,
      });
      
      return response.data;
    } catch (error) {
      console.log('Server not available, using basic AI analysis');
      return this.getBasicAnalysis(weatherData);
    }
  }

  static getDemoWeatherData() {
    const now = Date.now() / 1000;
    
    const current = {
      dt: now,
      temp: 18,
      feels_like: 16,
      pressure: 1013,
      humidity: 65,
      visibility: 10000,
      wind_speed: 3.5,
      wind_gust: 5.2,
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }]
    };

    const hourly = Array.from({ length: 24 }, (_, i) => ({
      dt: now + (i * 3600),
      temp: 18 + Math.sin(i * 0.3) * 5,
      wind_speed: 3 + Math.random() * 4,
      wind_gust: 4 + Math.random() * 6,
      weather: [{ main: i < 12 ? 'Clouds' : 'Clear', description: 'demo weather' }]
    }));

    const daily = Array.from({ length: 5 }, (_, i) => ({
      dt: now + (i * 86400),
      temp: { min: 12 + i, max: 22 + i },
      wind_speed: 2 + Math.random() * 6,
      weather: [{ main: 'Clear', description: 'demo weather' }]
    }));

    const weatherData = {
      current,
      hourly,
      daily,
      demoMode: true,
      apiVersion: 'demo'
    };

    return {
      ...weatherData,
      flightAnalysis: this.analyzeFlightConditions(weatherData),
      droneSpecs: DJI_NEO2_LIMITS
    };
  }

  static analyzeFlightConditions(weatherData) {
    const current = weatherData.current;
    const conditions = [];
    
    // Wind analysis
    const windSpeed = current.wind_speed;
    const windGust = current.wind_gust || windSpeed;
    
    if (windSpeed <= 5) {
      conditions.push({ type: 'wind', status: 'excellent', message: 'Calm winds - perfect for flying' });
    } else if (windSpeed <= 8) {
      conditions.push({ type: 'wind', status: 'good', message: 'Light winds - good flying conditions' });
    } else if (windSpeed <= DJI_NEO2_LIMITS.maxWindSpeed) {
      conditions.push({ type: 'wind', status: 'caution', message: 'Moderate winds - fly with caution' });
    } else {
      conditions.push({ type: 'wind', status: 'danger', message: 'High winds - do not fly' });
    }
    
    // Temperature analysis
    const temp = current.temp;
    if (temp >= DJI_NEO2_LIMITS.minOperatingTemp && temp <= DJI_NEO2_LIMITS.maxOperatingTemp) {
      conditions.push({ type: 'temperature', status: 'good', message: 'Temperature within operating range' });
    } else {
      conditions.push({ type: 'temperature', status: 'danger', message: 'Temperature outside operating range' });
    }
    
    // Weather conditions
    const weather = current.weather[0];
    if (['Rain', 'Snow', 'Thunderstorm'].includes(weather.main)) {
      conditions.push({ type: 'precipitation', status: 'danger', message: 'Precipitation detected - do not fly' });
    } else if (weather.main === 'Clouds') {
      conditions.push({ type: 'visibility', status: 'caution', message: 'Cloudy conditions - maintain visual contact' });
    } else {
      conditions.push({ type: 'visibility', status: 'good', message: 'Clear conditions for flying' });
    }
    
    // Overall flight recommendation
    const dangerConditions = conditions.filter(c => c.status === 'danger').length;
    const cautionConditions = conditions.filter(c => c.status === 'caution').length;
    
    let overallStatus;
    if (dangerConditions > 0) {
      overallStatus = 'danger';
    } else if (cautionConditions > 0) {
      overallStatus = 'caution';
    } else {
      overallStatus = 'excellent';
    }
    
    return {
      conditions,
      overallStatus,
      windSpeed,
      windGust,
      temperature: temp,
      weather: weather.main
    };
  }

  static getBasicAnalysis(weatherData) {
    const current = weatherData.current;
    const wind = current.wind_speed;
    const temp = current.temp;
    const weather = current.weather[0].description;
    
    // Enhanced summary for demo
    const summary = `Current conditions in Fuengirola show ${weather} with ${temp}°C temperature and ${wind} m/s wind speed. ${
      wind > DJI_NEO2_LIMITS.maxWindSpeed 
        ? 'Wind speed exceeds DJI Neo 2 limits - flight not recommended.' 
        : wind <= 5 
          ? 'Excellent wind conditions for stable drone flight.'
          : 'Wind conditions are within acceptable range for experienced pilots.'
    } Temperature is ${temp >= 0 && temp <= 30 ? 'optimal' : temp < 0 ? 'cold but manageable' : 'warm'} for drone operations.`;

    const analysis = this.analyzeFlightConditions(weatherData);
    
    let recommendation;
    let detailedAdvice = '';
    
    switch (analysis.overallStatus) {
      case 'excellent':
        recommendation = '🟢 Perfect conditions for drone flight. Enjoy your flight!';
        detailedAdvice = 'All parameters are within optimal ranges. Great time for aerial photography, mapping, or recreational flying. Consider taking advantage of these ideal conditions.';
        break;
      case 'good':
        recommendation = '🔵 Good conditions for flying. Monitor weather changes.';
        detailedAdvice = 'Conditions are favorable but keep an eye on weather updates. Perfect for most drone operations with standard precautions.';
        break;
      case 'caution':
        recommendation = '🟡 Fly with caution. Check all safety protocols.';
        detailedAdvice = 'Some conditions require extra attention. Ensure you have experience with current weather conditions and follow all safety guidelines.';
        break;
      case 'danger':
        recommendation = '🔴 Do not fly. Wait for better conditions.';
        detailedAdvice = 'Current conditions pose risks to safe drone operation. Wait for weather to improve before attempting flight.';
        break;
      default:
        recommendation = 'Check weather conditions carefully before flying.';
        detailedAdvice = 'Analyze all weather parameters before making flight decisions.';
    }

    return { 
      summary: summary + ' ' + detailedAdvice, 
      recommendation,
      confidence: weatherData.demoMode ? 'Demo Mode - Simulated Analysis' : 'Real-time Analysis',
      timestamp: new Date().toLocaleString()
    };
  }

  static getWeatherIcon(condition) {
    const iconMap = {
      Clear: 'sunny',
      Clouds: 'cloudy',
      Rain: 'rainy',
      Snow: 'snow',
      Thunderstorm: 'thunderstorm',
      Drizzle: 'rainy',
      Mist: 'cloudy',
      Fog: 'cloudy'
    };
    return iconMap[condition] || 'cloudy';
  }

  static getWindStatusColor(windSpeed) {
    if (windSpeed <= 5) return '#28a745'; // Green
    if (windSpeed <= 8) return '#17a2b8'; // Blue
    if (windSpeed <= 10) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  }

  static getStatusColor(status) {
    const colors = {
      excellent: '#28a745',
      good: '#17a2b8',
      caution: '#ffc107',
      danger: '#dc3545'
    };
    return colors[status] || '#6c757d';
  }
}

export default WeatherService;