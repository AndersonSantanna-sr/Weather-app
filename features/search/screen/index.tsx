import ForecastCard from '@/shared/components/ForecastCard';
import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { formatRelativeTime } from '@/shared/utils/dateHelpers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Autocomplete } from '../components';
import { useSearchStore } from '../stores/useSearchStore';
import { createStyles } from './styles';

const Search: FC = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.DRIZZLE];
  const { recentSearches, setSelectedQuery } = useSearchStore();

  const handleRecentPress = (lat: number, lon: number) => {
    setSelectedQuery(`${lat},${lon}`);
    router.push('/');
  };

  const handleNavigationBack = () => router.back();

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
        {recentSearches.length === 0 ? (
          <Text style={styles.subtitle}>No recent searches yet.</Text>
        ) : (
          recentSearches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.forecastCardContainer}
              onPress={() => handleRecentPress(item.lat, item.lon)}
              accessibilityRole="button"
              accessibilityLabel={`View weather for ${item.name}`}
            >
              <ForecastCard
                title={item.name}
                subtitle={formatRelativeTime(item.searchedAt)}
                avgTemperature={0}
                icon={0}
              />
            </TouchableOpacity>
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
