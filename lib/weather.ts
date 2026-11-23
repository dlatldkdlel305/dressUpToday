export interface WeatherSummary {
  temperature: number;
  apparentTemperature: number;
  weatherLabel: string;
  weatherEmoji: string;
  tempMin: number;
  tempMax: number;
  precipitationProbability: number;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_min?: number[];
    temperature_2m_max?: number[];
    precipitation_probability_max?: number[];
  };
}

function mapWeatherCode(code: number): {label: string; emoji: string} {
  if (code === 0) {
    return {label: '맑음', emoji: '☀️'};
  }
  if (code === 1 || code === 2) {
    return {label: '구름 조금', emoji: '⛅'};
  }
  if (code === 3) {
    return {label: '흐림', emoji: '☁️'};
  }
  if (code === 45 || code === 48) {
    return {label: '안개', emoji: '🌫️'};
  }
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return {label: '이슬비', emoji: '🌦️'};
  }
  if (
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return {label: '비', emoji: '🌧️'};
  }
  if (
    code === 71 ||
    code === 73 ||
    code === 75 ||
    code === 77 ||
    code === 85 ||
    code === 86
  ) {
    return {label: '눈', emoji: '❄️'};
  }
  if (code === 95 || code === 96 || code === 99) {
    return {label: '천둥·번개', emoji: '⛈️'};
  }
  return {label: '흐림', emoji: '☁️'};
}

function parseSingleNumber(raw: unknown): number | null {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseCoordinates(
  latRaw: unknown,
  lonRaw: unknown,
): {lat: number; lon: number} | null {
  const lat = parseSingleNumber(latRaw);
  const lon = parseSingleNumber(lonRaw);

  if (lat === null || lon === null) {
    return null;
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return {lat, lon};
}

export async function fetchWeatherByCoordinates(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherSummary> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code');
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  );
  url.searchParams.set('timezone', 'Asia/Seoul');
  url.searchParams.set('forecast_days', '1');

  const timeoutSignal = AbortSignal.timeout(10_000);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal: combinedSignal,
  });

  if (!response.ok) {
    throw new Error(`UPSTREAM_WEATHER_HTTP_${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data?.current;
  const daily = data?.daily;

  if (!current || !daily) {
    throw new Error('INVALID_WEATHER_PAYLOAD');
  }

  const {label, emoji} = mapWeatherCode(Number(current.weather_code ?? 3));

  return {
    temperature: Math.round(Number(current.temperature_2m ?? 0)),
    apparentTemperature: Math.round(Number(current.apparent_temperature ?? 0)),
    weatherLabel: label,
    weatherEmoji: emoji,
    tempMin: Math.round(Number(daily.temperature_2m_min?.[0] ?? 0)),
    tempMax: Math.round(Number(daily.temperature_2m_max?.[0] ?? 0)),
    precipitationProbability: Math.round(
      Number(daily.precipitation_probability_max?.[0] ?? 0),
    ),
  };
}
