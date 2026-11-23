export interface WeatherSummary {
  temperature: number;
  apparentTemperature: number;
  weatherLabel: string;
  weatherEmoji: string;
  tempMin: number;
  tempMax: number;
  precipitationProbability: number;
}

export async function fetchWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherSummary> {
  const params = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
  });

  const response = await fetch(`/api/weather?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했어요.');
  }

  const data = (await response.json()) as {weather?: WeatherSummary};
  if (!data?.weather) {
    throw new Error('날씨 데이터 형식이 올바르지 않아요.');
  }

  return data.weather;
}
