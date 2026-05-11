/* eslint-disable no-console */
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';

export const useUserLocation = () => {
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);

  const requestLocation = useCallback(async () => {
    setLocationError(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[useUserLocation] permission status:', status);
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
      const lastKnown = await Location.getLastKnownPositionAsync();
      const location =
        lastKnown ??
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));
      console.log('[useUserLocation] coords:', location.coords.latitude, location.coords.longitude);
      setLocationQuery(`${location.coords.latitude},${location.coords.longitude}`);
    } catch (err) {
      console.warn('[useUserLocation] location error:', JSON.stringify(err), String(err));
      const { status } = await Location.getForegroundPermissionsAsync().catch(() => ({
        status: 'denied' as const,
      }));
      console.log('[useUserLocation] fallback permission check:', status);
      if (status !== 'granted') {
        setPermissionDenied(true);
      } else {
        setLocationError(true);
      }
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        requestLocation();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [requestLocation]);

  return {
    locationQuery,
    permissionDenied,
    locationError,
    retry: () => Linking.openSettings(),
    retryLocation: requestLocation,
  };
};
