// Routes/weatherRoutes.js
import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import User from '../models/User.js';
import WeatherLog from '../models/weatherLogModel.js';

const router = express.Router();

const BASE_URL = 'https://api.weatherapi.com/v1';
const apiKey = () => process.env.WEATHER_API_KEY;
const SAVED_LIMIT = 50;

// Wrapped in an object so tests can replace the network call.
export const weatherClient = {
  async forecast(q) {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: { key: apiKey(), q, days: 3, aqi: 'no', alerts: 'no' },
      timeout: 10000,
    });
    return response.data;
  },
};

// "lat,lon" when the browser shares its location, otherwise a city name.
function locationQuery(query) {
  const lat = Number(query.lat);
  const lon = Number(query.lon);
  if (query.lat !== undefined && Number.isFinite(lat) && Number.isFinite(lon)
      && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    return `${lat},${lon}`;
  }
  const city = String(query.city || 'Dhaka').trim().slice(0, 80);
  return city || 'Dhaka';
}

function summarize(data) {
  const today = data.forecast?.forecastday?.[0]?.day || {};
  return {
    city: data.location?.name || '',
    region: [data.location?.region, data.location?.country].filter(Boolean).join(', '),
    condition: data.current?.condition?.text || '',
    icon: data.current?.condition?.icon ? `https:${data.current.condition.icon}` : '',
    tempC: data.current?.temp_c,
    feelsLikeC: data.current?.feelslike_c,
    humidity: data.current?.humidity,
    windKph: data.current?.wind_kph,
    rainMm: data.current?.precip_mm,
    chanceOfRain: today.daily_chance_of_rain,
    observedAt: data.current?.last_updated_epoch
      ? new Date(data.current.last_updated_epoch * 1000)
      : new Date(),
  };
}

// Only farmers (and admins) can keep a weather log. The app has no login token yet,
// so the frontend sends the id it stored at login and the server checks the role.
async function requireFarmer(userId, res) {
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({ error: 'Log in as a farmer to save weather' });
    return null;
  }
  const user = await User.findById(userId).select('type');
  if (!user || !['farmer', 'admin'].includes(user.type)) {
    res.status(403).json({ error: 'Only farmer accounts can save weather' });
    return null;
  }
  return user;
}

// Current weather plus a 3-day forecast
router.get('/', async (req, res) => {
  if (!apiKey()) return res.status(503).json({ error: 'WEATHER_API_KEY is not configured' });
  try {
    const data = await weatherClient.forecast(locationQuery(req.query));
    res.json({ ...data, summary: summarize(data) });
  } catch (error) {
    const status = error.response?.status === 400 ? 404 : 502;
    res.status(status).json({ error: status === 404 ? 'City not found' : 'Failed to fetch weather data' });
  }
});

// Autocomplete city search
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: { key: apiKey(), q: query },
      timeout: 10000,
    });
    res.json(response.data);
  } catch (error) {
    res.status(502).json({ error: 'Failed to search locations' });
  }
});

// A farmer's saved readings, newest first
router.get('/saved', async (req, res) => {
  const user = await requireFarmer(req.query.userId, res);
  if (!user) return;
  const logs = await WeatherLog.find({ user: user._id }).sort({ createdAt: -1 }).limit(SAVED_LIMIT);
  res.json(logs);
});

// Save the current weather for a city (or the farmer's location) to their log
router.post('/saved', async (req, res) => {
  const user = await requireFarmer(req.body?.userId, res);
  if (!user) return;
  if (!apiKey()) return res.status(503).json({ error: 'WEATHER_API_KEY is not configured' });

  let data;
  try {
    data = await weatherClient.forecast(locationQuery(req.body));
  } catch (error) {
    const status = error.response?.status === 400 ? 404 : 502;
    return res.status(status).json({ error: status === 404 ? 'City not found' : 'Failed to fetch weather data' });
  }

  const note = typeof req.body.note === 'string' ? req.body.note.slice(0, 300) : '';
  const log = await WeatherLog.create({ user: user._id, note, ...summarize(data) });
  res.status(201).json(log);
});

// Delete one of the farmer's own saved readings
router.delete('/saved/:id', async (req, res) => {
  const user = await requireFarmer(req.query.userId, res);
  if (!user) return;
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Saved weather not found' });
  const deleted = await WeatherLog.findOneAndDelete({ _id: req.params.id, user: user._id });
  if (!deleted) return res.status(404).json({ error: 'Saved weather not found' });
  res.json({ message: 'Deleted' });
});

export default router;
