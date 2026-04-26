import ForecastCard from '@/shared/components/ForecastCard';
import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Autocomplete } from '../components';
import { createStyles } from './styles';

type Props = {};

const Search: FC<Props> = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useRouter();
  const weatherCondition = WeatherCondition.DRIZZLE;
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const weather = [
    { id: '1', name: 'New York' },
    { id: '2', name: 'London' },
    { id: '3', name: 'Tokyo' },
  ];

  const handleNavigationBack = () => navigation.back();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
      />
      <View style={styles.autocompleteContainer}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.background.secondary} />
        </TouchableOpacity>
        <Autocomplete />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Recently seen:</Text>
        </View>
        {weather.map((item) => (
          <View key={item.id} style={styles.forecastCardContainer}>
            <ForecastCard title={item.name} avgTemperature={27} icon={item.id} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Search;
