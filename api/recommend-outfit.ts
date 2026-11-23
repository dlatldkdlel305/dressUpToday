import type {VercelRequest, VercelResponse} from '@vercel/node';
import {
  generateOutfitRecommendation,
  MissingApiKeyError,
  UpstreamResponseError,
  validateRecommendPayload,
} from '../lib/outfit.js';

function parseRequestBody(rawBody: unknown): unknown {
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }
  return rawBody;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({error: 'METHOD_NOT_ALLOWED'});
    return;
  }

  const payload = validateRecommendPayload(parseRequestBody(req.body));
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
}
