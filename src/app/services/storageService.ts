import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  setWeatherInfo: async (value: string) => {
    await AsyncStorage.setItem('weather_cache', value);
  },
  getWeatherInfo: async () => {
    return AsyncStorage.getItem('weather_cache');
  },
  storeFeeds: async (feeds: any[]) => {
    await AsyncStorage.setItem('feeds', JSON.stringify(feeds));
  },
  getFeeds: async () => {
    const feeds = await AsyncStorage.getItem('feeds');
    return feeds ? JSON.parse(feeds) : null;
  },
  removeFeeds: async () => {
    await AsyncStorage.removeItem('feeds');
  },
};
