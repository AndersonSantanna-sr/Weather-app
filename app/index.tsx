import { useSearchStore } from '@/features/search/stores/useSearchStore';
import {
  LocationPermissionDenied,
  SectionDays,
  SectionTime,
  WeatherError,
  WeatherInfo,
} from '@/features/weather/components';
import Header from '@/features/weather/components/Header';
import { useForecast } from '@/features/weather/hooks/useForecast';
import { useUserLocation } from '@/features/weather/hooks/useUserLocation';
import { WEATHER_GRADIENTS } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import DevNotificationTest from '@/shared/components/DevNotificationTest';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const { locationQuery, permissionDenied, retry } = useUserLocation();
  const { selectedQuery } = useSearchStore();
  const activeQuery = selectedQuery ?? locationQuery;
  const { data: weatherData, isLoading, isError, refetch } = useForecast(activeQuery);
  const weatherCondition = mapCodeToCondition(
    weatherData?.current?.condition.code || 0,
    !!weatherData?.current.is_day
  );
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const rainAlertEnabled = useSettings((s) => s.rainAlertEnabled);
  const rainAlertThreshold = useSettings((s) => s.rainAlertThreshold);
  const dailySummaryEnabled = useSettings((s) => s.dailySummaryEnabled);
  const temperatureAlertEnabled = useSettings((s) => s.temperatureAlertEnabled);
  const temperatureAlertThreshold = useSettings((s) => s.temperatureAlertThreshold);
  const temperatureUnit = useSettings((s) => s.temperatureUnit);

  useEffect(() => {
    if (!weatherData) return;
    scheduleWeatherNotifications(weatherData, {
      rainAlertEnabled,
      rainAlertThreshold,
      dailySummaryEnabled,
      temperatureAlertEnabled,
      temperatureAlertThreshold,
      temperatureUnit,
    });
  }, [
    weatherData,
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    temperatureUnit,
  ]);

  if (permissionDenied) return <LocationPermissionDenied onRetry={retry} />;

  if (!activeQuery) {
    return (
      <View style={styles.gpsLoadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError && !weatherData) return <WeatherError onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header weatherData={weatherData} weatherCondition={weatherCondition} />}
      />
      <BlurView intensity={70} tint="light" style={styles.cloudEffect}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <WeatherInfo weatherCurrent={weatherData?.current} />
          <SectionTime
            data={getNextHours(
              weatherData?.forecast?.forecastday[0].hour || [],
              weatherData?.forecast?.forecastday[1].hour || []
            )}
          />
          <SectionDays data={weatherData?.forecast?.forecastday || []} />
        </ScrollView>
      </BlurView>
      <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      {__DEV__ && <DevNotificationTest />}
    </View>
  );
}
