import React, { useState, useEffect } from 'react';
import './Weather.css';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Toronto');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCity(cityName);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity);
      setSearchCity('');
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && !loading && (
        <div className="weather-card">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
              className="weather-icon"
            />
            <div className="temperature">{Math.round(weatherData.main.temp)}°C</div>
          </div>
          
          <p className="weather-description">{weatherData.weather[0].description}</p>
          
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">Feels Like:</span>
              <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Humidity:</span>
              <span className="detail-value">{weatherData.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Wind Speed:</span>
              <span className="detail-value">{weatherData.wind.speed} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pressure:</span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;