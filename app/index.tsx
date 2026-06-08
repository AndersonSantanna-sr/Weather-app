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
import DevNotificationTest from '@/shared/components/DevNotificationTest';
import { WEATHER_GRADIENTS } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const { locationQuery, permissionDenied, locationError, retry, retryLocation } =
    useUserLocation();
  const { selectedQuery } = useSearchStore();
  const activeQuery = selectedQuery ?? locationQuery;
  const { data: weatherData, isLoading, isFetching, isError, refetch } = useForecast(activeQuery);
  const weatherCondition = mapCodeToCondition(
    weatherData?.current?.condition.code || 0,
    !!weatherData?.current.is_day
  );
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const setWeatherTheme = useWeatherThemeStore((s) => s.setWeatherTheme);
  const insets = useSafeAreaInsets();

  const rainAlertEnabled = useSettings((s) => s.rainAlertEnabled);
  const rainAlertThreshold = useSettings((s) => s.rainAlertThreshold);
  const dailySummaryEnabled = useSettings((s) => s.dailySummaryEnabled);
  const temperatureAlertEnabled = useSettings((s) => s.temperatureAlertEnabled);
  const temperatureAlertThreshold = useSettings((s) => s.temperatureAlertThreshold);
  const temperatureUnit = useSettings((s) => s.temperatureUnit);

  useEffect(() => {
    setWeatherTheme({
      textColor: gradient.textColor,
      subtextColor: gradient.subtextColor,
      faintColor: gradient.faintColor,
      heroText: gradient.heroText,
      heroSub: gradient.heroSub,
      surface: gradient.surface,
      surfaceStrong: gradient.surfaceStrong,
      border: gradient.border,
      divider: gradient.divider,
      chip: gradient.chip,
      darkGlass: gradient.darkGlass,
      blurTint: gradient.blurTint,
      gradientColors: gradient.colors,
      gradientLocations: gradient.locations,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherCondition, setWeatherTheme]);

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

  if (permissionDenied && !selectedQuery) return <LocationPermissionDenied onRetry={retry} />;

  if (locationError && !selectedQuery) return <WeatherError onRetry={retryLocation} />;

  if (!activeQuery || (isLoading && !weatherData)) {
    return (
      <View style={styles.gpsLoadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError && !weatherData) return <WeatherError onRetry={refetch} />;

  const forecastDay0 = weatherData?.forecast?.forecastday[0];
  const hiTempC = forecastDay0?.day.maxtemp_c ?? weatherData?.current.temp_c ?? 0;
  const loTempC = forecastDay0?.day.mintemp_c ?? weatherData?.current.temp_c ?? 0;

  return (
    <View style={styles.container}>
      {/* Gradient fills entire background */}
      <LinearGradient
        colors={gradient.colors}
        locations={gradient.locations}
        style={StyleSheet.absoluteFill}
      />

      {/* Header — normal flow, not absolute */}
      <Header
        weatherData={weatherData}
        weatherCondition={weatherCondition}
        conditionLabel={weatherData?.current.condition.text ?? ''}
        hiTempC={hiTempC}
        loTempC={loTempC}
        topInset={insets.top}
      />

      {/* Frosted glass panel — flex: 1 fills remaining vertical space */}
      <BlurView intensity={70} tint={gradient.blurTint} style={styles.cloudEffect}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <WeatherInfo weatherCurrent={weatherData?.current} />
          <SectionTime
            data={getNextHours(
              weatherData?.forecast?.forecastday[0].hour || [],
              weatherData?.forecast?.forecastday[1].hour || []
            )}
          />
          <SectionDays data={weatherData?.forecast?.forecastday || []} />
          <View style={{ height: insets.bottom + 16 }} />
        </ScrollView>
      </BlurView>

      <Modal animationType="slide" transparent={true} visible={isFetching && !!weatherData}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      {__DEV__ && <DevNotificationTest />}
    </View>
  );
}
