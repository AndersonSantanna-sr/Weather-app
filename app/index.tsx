import { SectionDays, SectionTime, WeatherInfo } from '@/features/weather/components';
import { weatherDataMock } from '@/features/weather/data/weatherDataMock';
import Header from '@/shared/components/Header';
import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { useWeatherThemeStore } from '@/store/useWeatherThemeStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const weatherCondition = WeatherCondition.CLEAR_NIGHT;
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const setWeatherTheme = useWeatherThemeStore((state) => state.setWeatherTheme);
  const theme = useAppTheme();
  const styles = createStyles(theme);
  useEffect(() => {
    setWeatherTheme(gradient.textColor, gradient.subtextColor);
  }, [weatherCondition]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header />}
      />
      <BlurView intensity={70} tint="light" style={styles.cloudEffect}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <WeatherInfo />
          <SectionTime
            data={getNextHours(
              weatherDataMock.forecast.forecastday[0].hour,
              weatherDataMock.forecast.forecastday[1].hour
            )}
          />
          <SectionDays data={weatherDataMock.forecast.forecastday} />
        </ScrollView>
      </BlurView>
      <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
}
