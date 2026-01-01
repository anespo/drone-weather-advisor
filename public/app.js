class DroneWeatherApp {
    constructor() {
        this.currentLocation = null;
        this.weatherData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.getCurrentLocation();
    }

    bindEvents() {
        document.getElementById('refresh-location').addEventListener('click', () => {
            this.getCurrentLocation();
        });
    }

    getCurrentLocation() {
        const locationText = document.getElementById('location-text');
        locationText.textContent = 'Getting location...';

        if (!navigator.geolocation) {
            locationText.textContent = 'Geolocation not supported';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                this.updateLocationDisplay();
                this.fetchWeatherData();
            },
            (error) => {
                console.error('Geolocation error:', error);
                locationText.textContent = 'Location access denied';
                // Use Fuengirola, Málaga, Spain coordinates
                this.currentLocation = { lat: 36.54167, lon: -4.62500 };
                this.updateLocationDisplay('Fuengirola, Málaga, Spain');
                this.fetchWeatherData();
            }
        );
    }

    async updateLocationDisplay(customText = null) {
        const locationText = document.getElementById('location-text');
        
        if (customText) {
            locationText.textContent = customText;
            return;
        }

        try {
            // Reverse geocoding to get location name
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&limit=1&appid=demo`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const location = data[0];
                    locationText.textContent = `${location.name}, ${location.country}`;
                } else {
                    locationText.textContent = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lon.toFixed(4)}`;
                }
            } else {
                locationText.textContent = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lon.toFixed(4)}`;
            }
        } catch (error) {
            locationText.textContent = `${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lon.toFixed(4)}`;
        }
    }

    async fetchWeatherData() {
        if (!this.currentLocation) return;

        try {
            const response = await fetch(`/api/weather/${this.currentLocation.lat}/${this.currentLocation.lon}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    this.showApiKeyError(errorData);
                    return;
                }
                throw new Error(errorData.error || 'Weather data fetch failed');
            }

            this.weatherData = await response.json();
            this.updateUI();
            this.fetchAIAnalysis();
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('Failed to fetch weather data. Please check your API configuration.');
        }
    }

    async fetchAIAnalysis() {
        if (!this.weatherData) return;

        try {
            const response = await fetch('/api/analyze-weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ weatherData: this.weatherData })
            });

            if (response.ok) {
                const analysis = await response.json();
                this.updateAIAnalysis(analysis);
            }
        } catch (error) {
            console.error('AI analysis error:', error);
        }
    }

    updateUI() {
        this.updateFlightStatus();
        this.updateCurrentWeather();
        this.updateHourlyForecast();
        this.updateDailyForecast();
        
        // Show demo mode indicator if active
        if (this.weatherData.demoMode) {
            this.showDemoModeIndicator();
        }
    }

    updateFlightStatus() {
        const statusCard = document.getElementById('flight-status-card');
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        const statusDetails = document.getElementById('status-details');

        const analysis = this.weatherData.flightAnalysis;
        
        // Update status indicator
        statusIndicator.className = `status-indicator status-${analysis.overallStatus}`;
        statusText.textContent = this.getStatusText(analysis.overallStatus);

        // Update status details
        statusDetails.innerHTML = analysis.conditions.map(condition => `
            <div class="condition-item condition-${condition.status}">
                <div class="condition-icon">
                    <i class="${this.getConditionIcon(condition.type)}"></i>
                </div>
                <div class="condition-info">
                    <div class="condition-message">${condition.message}</div>
                </div>
            </div>
        `).join('');
    }

    updateCurrentWeather() {
        const currentWeather = document.getElementById('current-weather');
        const current = this.weatherData.current;
        
        currentWeather.innerHTML = `
            <div class="current-weather-grid">
                <div class="weather-metric">
                    <i class="fas fa-thermometer-half"></i>
                    <span class="metric-value">${Math.round(current.temp)}°C</span>
                    <span class="metric-label">Temperature</span>
                </div>
                <div class="weather-metric">
                    <i class="fas fa-wind"></i>
                    <span class="metric-value">${current.wind_speed} m/s</span>
                    <span class="metric-label">Wind Speed</span>
                </div>
                <div class="weather-metric">
                    <i class="fas fa-eye"></i>
                    <span class="metric-value">${(current.visibility / 1000).toFixed(1)} km</span>
                    <span class="metric-label">Visibility</span>
                </div>
                <div class="weather-metric">
                    <i class="fas fa-tint"></i>
                    <span class="metric-value">${current.humidity}%</span>
                    <span class="metric-label">Humidity</span>
                </div>
                <div class="weather-metric">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span class="metric-value">${current.pressure} hPa</span>
                    <span class="metric-label">Pressure</span>
                </div>
                <div class="weather-metric">
                    <i class="fas fa-cloud"></i>
                    <span class="metric-value">${current.weather[0].main}</span>
                    <span class="metric-label">Conditions</span>
                </div>
            </div>
        `;
    }

    updateHourlyForecast() {
        const hourlyForecast = document.getElementById('hourly-forecast');
        const hourly = this.weatherData.hourly.slice(0, 12); // Next 12 hours
        
        hourlyForecast.innerHTML = hourly.map(hour => {
            const time = new Date(hour.dt * 1000);
            const windClass = this.getWindClass(hour.wind_speed);
            
            return `
                <div class="forecast-item">
                    <div class="forecast-time">${time.getHours()}:00</div>
                    <div class="forecast-icon">
                        <i class="fas ${this.getWeatherIcon(hour.weather[0].main)}"></i>
                    </div>
                    <div class="forecast-temp">${Math.round(hour.temp)}°C</div>
                    <div class="forecast-wind ${windClass}">
                        <i class="fas fa-wind"></i> ${hour.wind_speed} m/s
                    </div>
                </div>
            `;
        }).join('');
    }

    updateDailyForecast() {
        const dailyForecast = document.getElementById('daily-forecast');
        const daily = this.weatherData.daily;
        
        dailyForecast.innerHTML = daily.map(day => {
            const date = new Date(day.dt * 1000);
            const windClass = this.getWindClass(day.wind_speed);
            
            return `
                <div class="forecast-item">
                    <div class="forecast-time">${date.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div class="forecast-icon">
                        <i class="fas ${this.getWeatherIcon(day.weather[0].main)}"></i>
                    </div>
                    <div class="forecast-temp">${Math.round(day.temp.max)}°/${Math.round(day.temp.min)}°</div>
                    <div class="forecast-wind ${windClass}">
                        <i class="fas fa-wind"></i> ${day.wind_speed} m/s
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAIAnalysis(analysis) {
        const aiAnalysis = document.getElementById('ai-analysis');
        
        aiAnalysis.innerHTML = `
            <div class="analysis-summary">${analysis.summary}</div>
            <div class="analysis-recommendation">${analysis.recommendation}</div>
        `;
    }

    getStatusText(status) {
        const statusTexts = {
            excellent: 'Perfect Flying',
            good: 'Good Conditions',
            caution: 'Fly with Caution',
            danger: 'Do Not Fly'
        };
        return statusTexts[status] || 'Unknown';
    }

    getConditionIcon(type) {
        const icons = {
            wind: 'fas fa-wind',
            temperature: 'fas fa-thermometer-half',
            precipitation: 'fas fa-cloud-rain',
            visibility: 'fas fa-eye'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    getWeatherIcon(condition) {
        const icons = {
            Clear: 'fa-sun',
            Clouds: 'fa-cloud',
            Rain: 'fa-cloud-rain',
            Snow: 'fa-snowflake',
            Thunderstorm: 'fa-bolt',
            Drizzle: 'fa-cloud-drizzle',
            Mist: 'fa-smog',
            Fog: 'fa-smog'
        };
        return icons[condition] || 'fa-cloud';
    }

    getWindClass(windSpeed) {
        if (windSpeed <= 5) return 'wind-excellent';
        if (windSpeed <= 8) return 'wind-good';
        if (windSpeed <= 10) return 'wind-caution';
        return 'wind-danger';
    }

    showDemoModeIndicator() {
        const locationText = document.getElementById('location-text');
        locationText.innerHTML = `${locationText.textContent} <span style="color: #ffc107; font-weight: bold;">(DEMO MODE)</span>`;
        
        // Add demo notice to the header
        const header = document.querySelector('.header-content');
        if (!document.getElementById('demo-notice')) {
            const demoNotice = document.createElement('div');
            demoNotice.id = 'demo-notice';
            demoNotice.innerHTML = `
                <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 10px; margin-top: 15px; text-align: center;">
                    <strong>🔧 Demo Mode Active</strong><br>
                    <small>Your OpenWeather API key is still activating. Showing demo data for testing.</small>
                </div>
            `;
            header.appendChild(demoNotice);
        }
    }

    showApiKeyError(errorData) {
        const elements = [
            'current-weather',
            'hourly-forecast',
            'daily-forecast',
            'ai-analysis',
            'status-details'
        ];
        
        const errorMessage = `
            <div class="api-key-error">
                <h3><i class="fas fa-key"></i> API Key Issue</h3>
                <p><strong>${errorData.error}</strong></p>
                <p>${errorData.details}</p>
                <div class="error-instructions">
                    <h4>To fix this:</h4>
                    <ol>
                        <li>Update your <code>.env</code> file with your real OpenWeather API key</li>
                        <li>If you just created the key, wait a few minutes for activation</li>
                        <li>Restart the server: <code>npm start</code></li>
                    </ol>
                </div>
            </div>
        `;
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = errorMessage;
            }
        });

        // Update status indicator
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        if (statusIndicator && statusText) {
            statusIndicator.className = 'status-indicator status-danger';
            statusText.textContent = 'API Key Required';
        }
    }

    showError(message) {
        const elements = [
            'current-weather',
            'hourly-forecast',
            'daily-forecast',
            'ai-analysis'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `<div class="error">${message}</div>`;
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DroneWeatherApp();
});