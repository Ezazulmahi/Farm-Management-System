// Routes/weatherRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

const BASE_URL = 'https://api.weatherapi.com/v1';
const apiKey = () => process.env.WEATHER_API_KEY;

// 🌦️ Get current + forecast weather
router.get('/', async (req, res) => {
  if (!apiKey()) return res.status(503).json({ error: 'WEATHER_API_KEY is not configured' });
  const city = req.query.city || 'London';
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: apiKey(),
        q: city,
        days: 3,
        aqi: 'no',
        alerts: 'no',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 🔍 Autocomplete city search
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: apiKey(),
        q: query,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

export default router;
