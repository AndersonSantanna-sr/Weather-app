import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Autocomplete, RecentSearchCard } from '../components';
import { useSearchStore } from '../stores/useSearchStore';
import { createStyles } from './styles';

const Search: FC = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { gradientColors, gradientLocations, chip, border, darkGlass } = useWeatherThemeStore(
    (s) => s
  );
  const { recentSearches, setSelectedQuery } = useSearchStore();
  const iconColor = darkGlass ? 'rgba(255,255,255,0.9)' : 'rgba(21,32,46,0.8)';

  const handleRecentPress = (lat: number, lon: number) => {
    setSelectedQuery(`${lat},${lon}`);
    router.back();
  };

  const handleNavigationBack = () => router.back();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.autocompleteContainer}>
        <TouchableOpacity
          onPress={handleNavigationBack}
          style={[styles.backButton, { backgroundColor: chip, borderColor: border }]}
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
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
            <RecentSearchCard
              key={item.id}
              item={item}
              style={styles.forecastCardContainer}
              onPress={() => handleRecentPress(item.lat, item.lon)}
            />
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
