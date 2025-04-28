import React, { useState } from 'react';
import axios from 'axios';


const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeather(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not fetch weather data');
    }
  };

  return (
    <div className="weather-container">
      <h2 className="weather-title">Check Weather</h2>
      <div className="weather-form">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="weather-input"
        />
        <button onClick={fetchWeather} className="weather-button">
          Get Weather
        </button>
      </div>

      {weather && (
        <div className="weather-result">
          <h3>{weather.name}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
