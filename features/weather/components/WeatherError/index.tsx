import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from './styles';

type Props = {
  onRetry: () => void;
};

const WeatherError: FC<Props> = ({ onRetry }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.CLOUDY];

  return (
    <LinearGradient colors={gradient.colors} locations={[0, 1]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={80} color="white" style={styles.icon} />
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          Unable to load the forecast. Check your connection and try again.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.buttonText}>Search by city</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WeatherError;
