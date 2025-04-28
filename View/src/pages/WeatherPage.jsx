import React, { useState } from 'react';
import axios from 'axios';
import '../styles/WeatherPage.css';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // Handle typing and fetch suggestions
  const handleSearch = async (e) => {
    const query = e.target.value;
    setCity(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Select a suggestion
  const selectCity = (name) => {
    setCity(name);
    setSuggestions([]);
    getWeather(name);
  };

  // Fetch weather for selected city
  const getWeather = async (selectedCity = city) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${selectedCity}`);
      setWeather(res.data);
      setError('');
    } catch (err) {
      setError('Unable to get weather data');
      setWeather(null);
    }
  };

  return (
    <div className="App">
      <h1>🌍 Weather Forecast</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleSearch}
        />
        <button onClick={() => getWeather()}>Search</button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, idx) => (
            <li key={idx} onClick={() => selectCity(item.name)}>
              {item.name}, {item.country}
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Weather Info */}
      {weather && (
        <div className="weather-info">
          <h2>{weather.location.name}, {weather.location.country}</h2>
          <p>Current: {weather.current.condition.text}</p>
          <img src={weather.current.condition.icon} alt="weather icon" />
          <p>Temperature: {weather.current.temp_c}°C</p>

          <h3>3-Day Forecast</h3>
          <div className="forecast">
            {weather.forecast.forecastday.map((day, idx) => (
              <div key={idx} className="forecast-day">
                <p><strong>{day.date}</strong></p>
                <img src={day.day.condition.icon} alt="forecast icon" />
                <p>{day.day.condition.text}</p>
                <p>{day.day.avgtemp_c}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
