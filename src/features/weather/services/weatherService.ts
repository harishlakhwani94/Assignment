import { StorageService } from '../../../app/services/storageService';
import { apiClient } from '../../../app/network/apiClient';
import { Weather, WeatherRequestParam } from '../types/apiTypes';

const API_KEY = 'a9fd8d677072236ef07db591a0f2cefd';
const CACHE_DURATION = 15 * 60 * 1000;

export const fetchWeather = async (
  params: WeatherRequestParam,
  shouldCache: boolean = false,
): Promise<Weather> => {
  if (shouldCache) {
    const cached = await StorageService.getWeatherInfo();
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  }

  const searchParams = new URLSearchParams({
    lat: params.lat.toString(),
    lon: params.long.toString(),
    appid: API_KEY,
    units: 'metric',
  });
  const url = `https://api.openweathermap.org/data/2.5/weather?${searchParams.toString()}`;
  const data = await apiClient.get(url);
  if (shouldCache) {
    await StorageService.setWeatherInfo(
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  }
  return data;
};
