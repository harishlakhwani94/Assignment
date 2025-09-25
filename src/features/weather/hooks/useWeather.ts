import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { Weather } from '../types/apiTypes';

const useWeather = (
  location: { latitude: number; longitude: number } | null,
  shouldCache: boolean = false,
) => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      setSkeleton(true);
      if (!location) {
        setSkeleton(false);
        return;
      }
      try {
        const response = await fetchWeather(
          {
            lat: location.latitude,
            long: location.longitude,
          },
          shouldCache,
        );
        setWeather(response);
        setLoading(false);
        setSkeleton(false);
      } catch {
        setLoading(false);
        setSkeleton(false);
      }
    };
    getWeather();
  }, [location]);

  return { weather, loading, skeleton };
};

export default useWeather;
