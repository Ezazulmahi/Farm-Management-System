// Routes/weatherRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = 'a2115fc8971a474a87f153620251804'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
