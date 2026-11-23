import type {VercelRequest, VercelResponse} from '@vercel/node';
import {
  fetchWeatherByCoordinates,
  parseCoordinates,
} from '../lib/weather.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({error: 'METHOD_NOT_ALLOWED'});
    return;
  }

  const coords = parseCoordinates(req.query.lat, req.query.lon);
  if (!coords) {
    res.status(400).json({error: 'INVALID_COORDINATES'});
    return;
  }

  try {
    const weather = await fetchWeatherByCoordinates(coords.lat, coords.lon);
    res.status(200).json({weather});
  } catch (err) {
    console.error('Weather proxy error:', err);
    res.status(502).json({error: 'WEATHER_FETCH_FAILED'});
  }
}
