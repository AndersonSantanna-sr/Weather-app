import { WEATHER_GRADIENTS, WeatherCondition } from '@/constants/WeatherGradients';
import { SectionTime, WeatherInfo } from '@/features/weather/components';
import { weatherDataMock } from '@/features/weather/data/weatherDataMock';
import Header from '@/shared/Header/Header';
import { getNextHours } from '@/utils/dateHelpers';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

export default function TabOneScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const weatherCondition = WeatherCondition.STORMY;
  const gradient = WEATHER_GRADIENTS[weatherCondition];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header />}
      />

      <View style={[styles.cloudEffect, { backgroundColor: gradient.cloudColor }]}>
        <WeatherInfo />
        <SectionTime
          data={getNextHours(
            weatherDataMock.forecast.forecastday[0].hour,
            weatherDataMock.forecast.forecastday[1].hour
          )}
        />
      </View>
      <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudEffect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.9,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    zIndex: 1,
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginTop: 20,
    zIndex: 1,
  },
});
