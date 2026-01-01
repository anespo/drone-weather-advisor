# 🚁 Drone Weather Advisor

<div align="center">

![Drone Weather Advisor](https://img.shields.io/badge/Drone-Weather%20Advisor-blue?style=for-the-badge&logo=drone)
![DJI Neo 2](https://img.shields.io/badge/DJI-Neo%202-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen?style=for-the-badge&logo=node.js)
![React Native](https://img.shields.io/badge/React%20Native-Expo-blue?style=for-the-badge&logo=expo)

**The Ultimate Weather Advisory Application for Drone Pilots**

*Professional weather analysis specifically designed for DJI Neo 2 drone operations*

[🚀 Live Demo](#-quick-start) • [📱 Mobile App](#-mobile-app) • [🤝 Contributing](#-contributing) • [⭐ Star this repo](#)

</div>

---

## 🌟 Why Drone Weather Advisor?

Flying drones safely requires **precise weather analysis**. Generic weather apps don't understand drone specifications or flight safety requirements. **Drone Weather Advisor** changes that.

### ✨ **Key Features**

🎯 **DJI Neo 2 Specific Analysis**
- Wind speed monitoring (10 m/s limit)
- Temperature range validation (-10°C to 40°C)
- Precipitation detection (not waterproof)
- Professional flight recommendations

🧠 **AI-Powered Weather Analysis**
- Enhanced weather assessment engine
- Intelligent flight safety recommendations
- Color-coded risk indicators (🟢🔵🟡🔴)
- Ready for Gemini AI integration

🌍 **Real-Time Weather Data**
- OpenWeatherMap integration
- GPS location detection
- 5-day weather forecasts
- 24-hour detailed predictions

📱 **Cross-Platform Experience**
- Professional web application
- Native mobile app (iOS/Android)
- Responsive design
- Offline demo mode

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenWeatherMap API key ([Get free key](https://openweathermap.org/api))
- Optional: Gemini AI API key ([Get key](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/anespo/drone-weather-advisor.git
cd drone-weather-advisor

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the application
npm start
```

**🌐 Open http://localhost:3000**

---

## 📱 Mobile App

### React Native + Expo

```bash
# Navigate to mobile app
cd DroneWeatherMobile

# Install dependencies
npm install

# Start development server
npx expo start

# Scan QR code with Expo Go app
```

**📲 Test on your device with Expo Go**

---

## 🎯 Perfect For

- **🏢 Commercial Drone Operators** - Professional weather analysis
- **📸 Aerial Photographers** - Optimal conditions for shoots
- **🎮 Recreational Pilots** - Safe flying recommendations
- **🏗️ Construction & Surveying** - Weather-dependent operations
- **🚁 Drone Service Providers** - Client safety assurance

---

## 🛠️ Technology Stack

### Backend
- **Node.js** + Express
- **OpenWeatherMap API** - Real-time weather data
- **Gemini AI** - Enhanced analysis (optional)

### Frontend (Web)
- **Vanilla JavaScript** - Fast and lightweight
- **Modern CSS** - Professional gradients and animations
- **Font Awesome** - Beautiful icons
- **Responsive Design** - Works on all devices

### Mobile App
- **React Native** + Expo
- **Cross-platform** - iOS and Android
- **Native Performance** - Smooth user experience
- **GPS Integration** - Automatic location detection

---

## 🌈 Screenshots

### Web Application
*Professional dashboard with real-time weather analysis*

### Mobile Application  
*Native mobile experience with touch-optimized interface*

---

## 🔧 Configuration

### Environment Variables

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### API Keys Setup

1. **OpenWeatherMap** (Required)
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for free account
   - Get API key (1000 calls/day free)

2. **Gemini AI** (Optional)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create free API key
   - Enhanced AI analysis

---

## 🚁 DJI Neo 2 Specifications

| Parameter | Limit | Monitoring |
|-----------|-------|------------|
| **Max Wind Speed** | 10 m/s (36 km/h) | ✅ Real-time |
| **Operating Temperature** | -10°C to 40°C | ✅ Continuous |
| **Max Altitude** | 4000m | ℹ️ Reference |
| **Water Resistance** | None | ⚠️ Precipitation alerts |

---

## 🎨 Features Deep Dive

### 🌦️ Weather Analysis
- **Current Conditions** - Temperature, wind, humidity, pressure
- **Flight Status** - Color-coded safety recommendations
- **Hourly Forecast** - Next 24 hours detailed
- **5-Day Forecast** - Extended planning capability

### 🧠 AI Analysis Engine
- **Intelligent Assessment** - Drone-specific weather evaluation
- **Risk Categorization** - Excellent/Good/Caution/Danger
- **Detailed Explanations** - Why conditions are safe/unsafe
- **Professional Recommendations** - Actionable flight advice

### 📍 Location Services
- **GPS Detection** - Automatic location finding
- **Manual Override** - Custom location selection
- **Fallback Location** - Fuengirola, Málaga, Spain
- **Location Refresh** - Update weather for new locations

---

## 🚀 Deployment

### Web Application
```bash
# Production build
npm run build

# Deploy to your preferred platform
# Vercel, Netlify, Heroku, AWS, etc.
```

### Mobile Application
```bash
# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android

# Publish to app stores
npx eas submit
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use GitHub Issues
- Include screenshots
- Describe steps to reproduce

### ✨ Feature Requests
- Suggest new drone models
- Weather parameter ideas
- UI/UX improvements

### 💻 Code Contributions
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📊 Roadmap

### 🎯 Version 2.0
- [ ] Multiple drone model support
- [ ] Weather alerts and notifications
- [ ] Flight log integration
- [ ] Advanced wind analysis (gusts, direction)

### 🎯 Version 3.0
- [ ] Community weather reports
- [ ] Flight planning tools
- [ ] Weather history analysis
- [ ] Professional pilot features

---

## 🏆 Why This Project Matters

### 🛡️ Safety First
Drone accidents often result from poor weather decisions. This app provides **professional-grade weather analysis** specifically for drone operations.

### 💰 Cost Savings
Avoid damaged equipment and failed missions by making **informed weather decisions**.

### 📈 Professional Growth
Perfect for **commercial operators** who need reliable weather assessment for client operations.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** - Reliable weather data API
- **Google Gemini** - AI analysis capabilities
- **Expo** - Amazing React Native development platform
- **DJI** - Inspiring drone innovation

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/anespo/drone-weather-advisor/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/anespo/drone-weather-advisor/discussions)
- 📧 **Email**: [Contact](mailto:your-email@example.com)

---

<div align="center">

**⭐ Star this repository if it helped you fly safely! ⭐**

*Made with ❤️ for the drone community*

[🔝 Back to top](#-drone-weather-advisor)

</div>