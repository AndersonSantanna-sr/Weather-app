import { SectionDays, SectionTime, WeatherInfo } from '@/features/weather/components';
import Header from '@/features/weather/components/Header';
import { useForecast } from '@/features/weather/hooks/useForecast';
import { WEATHER_GRADIENTS } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const { data: weatherData, isLoading } = useForecast('Indaiatuba');
  const weatherCondition = mapCodeToCondition(
    weatherData?.current?.condition.code || 0,
    !!weatherData?.current.is_day
  );
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header weatherCondition={weatherCondition} />}
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
    </View>
  );
}
