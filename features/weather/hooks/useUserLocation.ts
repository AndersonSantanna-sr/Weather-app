import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';

export const useUserLocation = () => {
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      return;
    }
    setPermissionDenied(false);
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocationQuery(`${location.coords.latitude},${location.coords.longitude}`);
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        requestLocation();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);

  const retry = () => Linking.openSettings();

  return { locationQuery, permissionDenied, retry };
};
