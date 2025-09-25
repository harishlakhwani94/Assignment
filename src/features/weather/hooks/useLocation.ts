import { useState, useEffect } from 'react';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const useLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      let permission;
      if (Platform.OS === 'ios') {
        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }
      if (permission !== RESULTS.GRANTED) {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          setError('Failed to get location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };
    getLocation();
  }, []);

  return { location, error, loading };
};

export default useLocation;
