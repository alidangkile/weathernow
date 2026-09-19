/**
 * WeatherNow V1 — Application Logic
 * Phase 3: Weather Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');

  // State Containers
  const emptyState = document.getElementById('empty-state');
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const weatherContainer = document.getElementById('weather-container');

  // Weather Card Elements
  const weatherCity = document.getElementById('weather-city');
  const weatherCountry = document.getElementById('weather-country');
  const weatherConditionIcon = document.getElementById('weather-condition-icon');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherCondition = document.getElementById('weather-condition');
  const weatherFeelsLike = document.getElementById('weather-feels-like');
  const weatherHumidity = document.getElementById('weather-humidity');
  const weatherWind = document.getElementById('weather-wind');

  // State data for testing/inspection
  let lastLocation = null;
  let lastWeatherData = null;

  /**
   * WMO Weather interpretation codes mapping
   */
  const WEATHER_CODES = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    56: { description: 'Light freezing drizzle', icon: '🌨️' },
    57: { description: 'Dense freezing drizzle', icon: '🌨️' },
    61: { description: 'Slight rain', icon: '🌦️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    66: { description: 'Light freezing rain', icon: '🌨️' },
    67: { description: 'Heavy freezing rain', icon: '🌨️' },
    71: { description: 'Slight snow fall', icon: '🌨️' },
    73: { description: 'Moderate snow fall', icon: '🌨️' },
    75: { description: 'Heavy snow fall', icon: '❄️' },
    77: { description: 'Snow grains', icon: '❄️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '❄️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
  };

  /**
   * Helper to map weather_code to readable condition
   */
  function getWeatherCondition(code) {
    return WEATHER_CODES[code] || { description: 'Unknown condition', icon: '🌡️' };
  }

  /**
   * Switch UI states cleanly
   * Available states: 'empty' | 'loading' | 'error' | 'success'
   */
  function setUIState(state) {
    emptyState.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherContainer.classList.add('hidden');

    switch (state) {
      case 'loading':
        loadingState.classList.remove('hidden');
        break;
      case 'error':
        errorState.classList.remove('hidden');
        break;
      case 'success':
        weatherContainer.classList.remove('hidden');
        break;
      case 'empty':
      default:
        emptyState.classList.remove('hidden');
        break;
    }
  }

  /**
   * Display error state with custom title and message
   */
  function showError(title, message) {
    if (errorTitle) {
      errorTitle.textContent = title;
    }
    if (errorMessage) {
      errorMessage.textContent = message;
    }
    setUIState('error');
  }

  /**
   * Render weather information on the Weather Card
   */
  function renderWeather(location, weather) {
    const current = weather.current;
    const condition = getWeatherCondition(current.weather_code);

    weatherCity.textContent = location.name;
    weatherCountry.textContent = location.country || '';

    if (weatherConditionIcon) {
      weatherConditionIcon.textContent = condition.icon;
    }

    // 5 Weather Fields per PRD
    // 1. Temperature
    weatherTemp.textContent = Math.round(current.temperature_2m);
    // 2. Weather Condition
    weatherCondition.textContent = condition.description;
    // 3. Feels like
    weatherFeelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    // 4. Humidity
    weatherHumidity.textContent = `${current.relative_humidity_2m}%`;
    // 5. Wind speed
    weatherWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    setUIState('success');
  }

  /**
   * Complete Search Flow:
   * 1. Geocoding API -> location (lat, lon)
   * 2. Forecast API -> current weather
   * Keep loading state active across both API calls.
   */
  async function searchWeather(cityName) {
    setUIState('loading');
    searchBtn.disabled = true;
    cityInput.disabled = true;

    try {
      // Step 1: Geocoding
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);

      if (!geoResponse.ok) {
        throw new Error(`Geocoding API HTTP ${geoResponse.status}`);
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        showError('Không tìm thấy thành phố', 'Vui lòng kiểm tra lại chính tả hoặc thử tên thành phố khác.');
        return;
      }

      const firstResult = geoData.results[0];
      lastLocation = {
        name: firstResult.name,
        country: firstResult.country || '',
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        timezone: firstResult.timezone || 'auto'
      };

      // Step 2: Weather Forecast (Loading state remains active)
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lastLocation.latitude}&longitude=${lastLocation.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
      const weatherResponse = await fetch(forecastUrl);

      if (!weatherResponse.ok) {
        throw new Error(`Forecast API HTTP ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();

      if (!weatherData.current) {
        showError('Lỗi dữ liệu thời tiết', 'Dữ liệu thời tiết không hợp lệ. Vui lòng thử lại sau.');
        return;
      }

      lastWeatherData = weatherData;

      // Step 3: Render success
      renderWeather(lastLocation, weatherData);
    } catch (err) {
      showError('Lỗi kết nối', 'Không thể lấy dữ liệu thời tiết. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } finally {
      searchBtn.disabled = false;
      cityInput.disabled = false;
    }
  }

  // Handle search form submission
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = cityInput.value.trim();
    if (!query) {
      showError('Vui lòng nhập tên thành phố', 'Ô tìm kiếm không được để trống.');
      return;
    }

    searchWeather(query);
  });

  // Expose helpers for automated testing/verification
  window.__searchWeather = searchWeather;
  window.__getLastLocation = () => lastLocation;
  window.__getLastWeatherData = () => lastWeatherData;
  window.__getWeatherCondition = getWeatherCondition;

  // Initial State: Empty
  setUIState('empty');
});
