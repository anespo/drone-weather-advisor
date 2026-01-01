const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// DJI Neo 2 specifications for weather limits
const DJI_NEO2_LIMITS = {
  maxWindSpeed: 10, // m/s (36 km/h)
  maxOperatingTemp: 40, // °C
  minOperatingTemp: -10, // °C
  maxAltitude: 4000, // meters
  ipRating: 'None' // Not waterproof
};

// Test API key endpoint
app.get('/api/test-key', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'paste_your_api_key_here') {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Test with the simplest API call
    const testResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`
    );
    
    res.json({ 
      status: 'success', 
      message: 'API key is working',
      testData: {
        location: testResponse.data.name,
        temp: testResponse.data.main.temp,
        weather: testResponse.data.weather[0].description
      }
    });
    
  } catch (error) {
    console.error('API key test error:', error.message);
    res.status(401).json({ 
      error: 'API key test failed',
      details: error.response?.data?.message || error.message
    });
  }
});

// Weather API endpoint
app.get('/api/weather/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'demo_key_replace_with_real_key') {
      return res.status(500).json({ error: 'Please update your OpenWeather API key in the .env file' });
    }

    let weatherData;
    
    try {
      // Try One Call API 3.0 first
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,alerts`
      );
      weatherData = weatherResponse.data;
      console.log('Using One Call API 3.0');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('One Call API 3.0 not ready, trying 2.5 API...');
        
        try {
          // Fallback to free 2.5 API
          const [currentResponse, forecastResponse] = await Promise.all([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
          ]);
          
          // Convert 2.5 API format to 3.0 format
          weatherData = convertApiFormat(currentResponse.data, forecastResponse.data);
          console.log('Using OpenWeather API 2.5 as fallback');
        } catch (fallbackError) {
          console.error('Both APIs failed, using demo data:', fallbackError.message);
          // Use demo data while API key is activating
          weatherData = getDemoWeatherData();
        }
      } else {
        throw error;
      }
    }
    
    // Analyze flight conditions
    const flightAnalysis = analyzeFlightConditions(weatherData);
    
    res.json({
      current: weatherData.current,
      hourly: weatherData.hourly.slice(0, 24), // Next 24 hours
      daily: weatherData.daily.slice(0, 5), // Next 5 days
      flightAnalysis,
      droneSpecs: DJI_NEO2_LIMITS,
      apiVersion: weatherData.apiVersion || '3.0',
      demoMode: weatherData.demoMode || false
    });
    
  } catch (error) {
    console.error('Weather API error:', error.message);
    if (error.response && error.response.status === 401) {
      res.status(401).json({ 
        error: 'API key authentication failed. Please check your OpenWeather API key.',
        details: 'If you just created the API key, it may take a few minutes to activate.'
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

// Gemini AI analysis endpoint
app.post('/api/analyze-weather', async (req, res) => {
  try {
    const { weatherData } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey || geminiApiKey === '') {
      return res.json(generateEnhancedAnalysis(weatherData));
    }

    // For now, provide enhanced basic analysis
    // You can integrate Gemini API later when ready
    const analysis = generateEnhancedAnalysis(weatherData);
    
    res.json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze weather data' });
  }
});

function getDemoWeatherData() {
  const now = Date.now() / 1000;
  
  return {
    current: {
      dt: now,
      temp: 18,
      feels_like: 16,
      pressure: 1013,
      humidity: 65,
      visibility: 10000,
      wind_speed: 3.5,
      wind_gust: 5.2,
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }]
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: now + (i * 3600),
      temp: 18 + Math.sin(i * 0.3) * 5,
      wind_speed: 3 + Math.random() * 4,
      wind_gust: 4 + Math.random() * 6,
      weather: [{ main: i < 12 ? 'Clouds' : 'Clear', description: 'demo weather' }]
    })),
    daily: Array.from({ length: 5 }, (_, i) => ({
      dt: now + (i * 86400),
      temp: { min: 12 + i, max: 22 + i },
      wind_speed: 2 + Math.random() * 6,
      weather: [{ main: 'Clear', description: 'demo weather' }]
    })),
    demoMode: true,
    apiVersion: 'demo'
  };
}

function convertApiFormat(currentData, forecastData) {
  // Convert OpenWeatherMap 2.5 API format to 3.0 format
  const current = {
    dt: currentData.dt,
    temp: currentData.main.temp,
    feels_like: currentData.main.feels_like,
    pressure: currentData.main.pressure,
    humidity: currentData.main.humidity,
    visibility: currentData.visibility || 10000,
    wind_speed: currentData.wind.speed,
    wind_gust: currentData.wind.gust,
    weather: currentData.weather
  };

  // Convert 5-day forecast to hourly (3-hour intervals from 2.5 API)
  const hourly = forecastData.list.slice(0, 8).map(item => ({
    dt: item.dt,
    temp: item.main.temp,
    wind_speed: item.wind.speed,
    wind_gust: item.wind.gust,
    weather: item.weather
  }));

  // Create daily forecast from 5-day forecast
  const dailyMap = new Map();
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        dt: item.dt,
        temp: { min: item.main.temp, max: item.main.temp },
        wind_speed: item.wind.speed,
        weather: item.weather
      });
    } else {
      const day = dailyMap.get(date);
      day.temp.min = Math.min(day.temp.min, item.main.temp);
      day.temp.max = Math.max(day.temp.max, item.main.temp);
    }
  });

  const daily = Array.from(dailyMap.values()).slice(0, 5);

  return {
    current,
    hourly,
    daily,
    apiVersion: '2.5'
  };
}

function analyzeFlightConditions(weatherData) {
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

function generateEnhancedAnalysis(weatherData) {
  const current = weatherData.current;
  const wind = current.wind_speed;
  const temp = current.temp;
  const weather = current.weather[0].description;
  
  // Enhanced summary
  const summary = `Current conditions in your location show ${weather} with ${temp}°C temperature and ${wind} m/s wind speed. ${
    wind > DJI_NEO2_LIMITS.maxWindSpeed 
      ? 'Wind speed exceeds DJI Neo 2 limits - flight not recommended.' 
      : wind <= 5 
        ? 'Excellent wind conditions for stable drone flight.'
        : 'Wind conditions are within acceptable range for experienced pilots.'
  } Temperature is ${temp >= 0 && temp <= 30 ? 'optimal' : temp < 0 ? 'cold but manageable' : 'warm'} for drone operations. ${
    current.humidity > 80 ? 'High humidity may affect battery performance.' : 'Humidity levels are acceptable.'
  } ${
    current.visibility < 5000 ? 'Reduced visibility - maintain close visual contact with drone.' : 'Good visibility for drone operations.'
  }`;

  const analysis = analyzeFlightConditions(weatherData);
  
  let recommendation;
  let detailedAdvice = '';
  
  switch (analysis.overallStatus) {
    case 'excellent':
      recommendation = '🟢 Perfect conditions for drone flight. Enjoy your flight!';
      detailedAdvice = 'All parameters are within optimal ranges. Great time for aerial photography, mapping, or recreational flying. Consider taking advantage of these ideal conditions for complex maneuvers or extended flight sessions.';
      break;
    case 'good':
      recommendation = '🔵 Good conditions for flying. Monitor weather changes.';
      detailedAdvice = 'Conditions are favorable but keep an eye on weather updates. Perfect for most drone operations with standard precautions. Check forecasts for any incoming weather changes.';
      break;
    case 'caution':
      recommendation = '🟡 Fly with caution. Check all safety protocols.';
      detailedAdvice = 'Some conditions require extra attention. Ensure you have experience with current weather conditions, double-check all equipment, and consider shorter flight times. Stay close to takeoff point.';
      break;
    case 'danger':
      recommendation = '🔴 Do not fly. Wait for better conditions.';
      detailedAdvice = 'Current conditions pose significant risks to safe drone operation. Wait for weather to improve before attempting flight. Monitor forecasts for better conditions.';
      break;
    default:
      recommendation = 'Check weather conditions carefully before flying.';
      detailedAdvice = 'Analyze all weather parameters before making flight decisions.';
  }

  return { 
    summary: summary + ' ' + detailedAdvice, 
    recommendation,
    confidence: weatherData.demoMode ? 'Demo Mode - Simulated Analysis' : 'Real-time Analysis',
    timestamp: new Date().toLocaleString(),
    powered_by: 'Enhanced Weather Analysis Engine'
  };
}

function generateBasicSummary(weatherData) {
  const current = weatherData.current;
  const wind = current.wind_speed;
  const temp = current.temp;
  const weather = current.weather[0].description;
  
  return `Current conditions: ${weather} with ${temp}°C temperature and ${wind} m/s wind speed. ${
    wind > DJI_NEO2_LIMITS.maxWindSpeed ? 'Wind speed exceeds drone limits.' : 'Wind conditions are within acceptable range.'
  }`;
}

function generateBasicRecommendation(weatherData) {
  const analysis = analyzeFlightConditions(weatherData);
  
  switch (analysis.overallStatus) {
    case 'excellent':
      return 'Perfect conditions for drone flight. Enjoy your flight!';
    case 'good':
      return 'Good conditions for flying. Monitor weather changes.';
    case 'caution':
      return 'Fly with caution. Check all safety protocols.';
    case 'danger':
      return 'Do not fly. Wait for better conditions.';
    default:
      return 'Check weather conditions carefully before flying.';
  }
}

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Drone Weather Advisor running on http://localhost:${PORT}`);
  console.log('Make sure to set your API keys in .env file');
});