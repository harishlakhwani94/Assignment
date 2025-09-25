import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useLocation from '../hooks/useLocation';
import useWeather from '../hooks/useWeather';

const WeatherScreen = () => {
  const {
    location: userLocation,
    error: locationError,
    loading: locationLoading,
  } = useLocation();
  const { weather, loading, skeleton } = useWeather(userLocation, true);

  if (skeleton || locationLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonBox} />
        <View style={styles.skeletonBox} />
        <View style={styles.skeletonBox} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Weather In {weather?.name}</Text>
      <Text style={styles.label}>Temperature: {weather?.main?.temp}°C</Text>
      <Text style={styles.label}>Condition: {weather?.weather?.[0]?.main}</Text>
      <Text style={styles.label}>Humidity: {weather?.main?.humidity}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  skeletonBox: {
    width: 220,
    height: 28,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default WeatherScreen;
