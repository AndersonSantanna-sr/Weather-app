import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

export const useUserLocation = () => {
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocationQuery(`${location.coords.latitude},${location.coords.longitude}`);
    })();
  }, []);

  const retry = () => Linking.openSettings();

  return { locationQuery, permissionDenied, retry };
};
