import 'dotenv/config';
import express from 'express';
import type {Request, Response} from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  generateOutfitRecommendation,
  MissingApiKeyError,
  UpstreamResponseError,
  validateRecommendPayload,
} from './lib/outfit.ts';
import {
  fetchWeatherByCoordinates,
  parseCoordinates,
} from './lib/weather.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);

  app.use(express.json({limit: '64kb'}));

  app.get('/api/weather', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');

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
  });

  app.post('/api/recommend-outfit', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const payload = validateRecommendPayload(req.body);
    if (!payload) {
      res.status(400).json({error: 'INVALID_REQUEST'});
      return;
    }

    try {
      const recommendation = await generateOutfitRecommendation(payload);
      res.status(200).json({recommendation});
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        console.error('Server configuration error: GEMINI_API_KEY is missing');
        res.status(503).json({error: 'SERVICE_UNAVAILABLE'});
        return;
      }
      if (err instanceof UpstreamResponseError) {
        res.status(502).json({error: err.code});
        return;
      }
      console.error('Gemini outfit recommendation error:', err);
      res.status(502).json({error: 'RECOMMENDATION_FAILED'});
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

void startServer();
