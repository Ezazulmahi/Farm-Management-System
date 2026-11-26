// eslint-disable-next-line no-unused-vars -- vite.config.js uses the classic JSX runtime, which needs React in scope
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../styles/WeatherPage.css";

const API = "http://localhost:5000/api/weather";
const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch {
    return null;
  }
}

const formatTime = (value) =>
  new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const errorText = (error, fallback) => error.response?.data?.error || fallback;

const Weather = () => {
  const user = readUser();
  const userId = user?.id;
  const canSave = Boolean(user && ["farmer", "admin"].includes(user.type));

  const [query, setQuery] = useState({ city: "Dhaka" });
  const [selectedCity, setSelectedCity] = useState("Dhaka");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saved, setSaved] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadWeather = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(API, { params });
      setWeather(data.summary);
    } catch (err) {
      setWeather(null);
      setError(errorText(err, "Weather data not available."));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSaved = useCallback(async () => {
    if (!canSave) return;
    try {
      const { data } = await axios.get(`${API}/saved`, { params: { userId } });
      setSaved(data);
    } catch (err) {
      setMessage(errorText(err, "Could not load your saved weather."));
    }
  }, [canSave, userId]);

  useEffect(() => {
    loadWeather(query);
  }, [query, loadWeather]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setQuery({ city: e.target.value });
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setMessage("This browser can't share your location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSelectedCity("");
        setQuery({ lat: coords.latitude.toFixed(4), lon: coords.longitude.toFixed(4) });
      },
      () => setMessage("Location permission was denied. Pick a city instead.")
    );
  };

  const saveWeather = async () => {
    setSaving(true);
    setMessage("");
    try {
      const { data } = await axios.post(`${API}/saved`, { userId, note, ...query });
      setSaved((prev) => [data, ...prev]);
      setNote("");
      setMessage(`Saved ${data.city} at ${formatTime(data.createdAt)}.`);
    } catch (err) {
      setMessage(errorText(err, "Could not save the weather."));
    } finally {
      setSaving(false);
    }
  };

  const deleteSaved = async (id) => {
    try {
      await axios.delete(`${API}/saved/${id}`, { params: { userId } });
      setSaved((prev) => prev.filter((log) => log._id !== id));
    } catch (err) {
      setMessage(errorText(err, "Could not delete that entry."));
    }
  };

  return (
    <div className="weather-page">
      <h1>Weather in {weather?.city || selectedCity || "your area"}</h1>

      <div className="weather-controls">
        <label htmlFor="weather-city" className="visually-hidden">City</label>
        <select id="weather-city" value={selectedCity} onChange={handleCityChange}>
          {!selectedCity && <option value="">My location</option>}
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="button" className="weather-btn secondary" onClick={useMyLocation}>
          Use my location
        </button>
      </div>

      {loading ? (
        <p>Loading weather...</p>
      ) : weather ? (
        <div className="weather-card">
          {weather.icon && <img src={weather.icon} alt="" width="64" height="64" />}
          <h2>{weather.condition}</h2>
          {weather.region && <p className="weather-region">{weather.region}</p>}
          <p>🌡️ Temp: {weather.tempC}°C (feels like {weather.feelsLikeC}°C)</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬️ Wind: {weather.windKph} km/h</p>
          <p>🌧️ Chance of rain today: {weather.chanceOfRain ?? 0}%</p>

          {canSave ? (
            <div className="weather-save">
              <label htmlFor="weather-note" className="visually-hidden">Note</label>
              <input
                id="weather-note"
                type="text"
                maxLength={300}
                placeholder="Note (optional), e.g. sprayed pesticide"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button type="button" className="weather-btn" onClick={saveWeather} disabled={saving}>
                {saving ? "Saving..." : "Save this weather"}
              </button>
            </div>
          ) : (
            <p className="weather-hint">Log in with a farmer account to save weather readings.</p>
          )}
        </div>
      ) : (
        <p>{error || "Weather data not available."}</p>
      )}

      {message && <p className="weather-message" role="status">{message}</p>}

      {canSave && (
        <section className="weather-saved">
          <h2>My saved weather</h2>
          {saved.length === 0 ? (
            <p className="weather-hint">Nothing saved yet. Press &ldquo;Save this weather&rdquo; to keep a reading.</p>
          ) : (
            <div className="weather-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Saved</th>
                    <th>Place</th>
                    <th>Condition</th>
                    <th>Temp</th>
                    <th>Humidity</th>
                    <th>Wind</th>
                    <th>Rain chance</th>
                    <th>Note</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {saved.map((log) => (
                    <tr key={log._id}>
                      <td>{formatTime(log.createdAt)}</td>
                      <td>{log.city}</td>
                      <td>{log.condition}</td>
                      <td>{log.tempC}°C</td>
                      <td>{log.humidity}%</td>
                      <td>{log.windKph} km/h</td>
                      <td>{log.chanceOfRain ?? 0}%</td>
                      <td>{log.note}</td>
                      <td>
                        <button type="button" className="weather-btn danger" onClick={() => deleteSaved(log._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Weather;
