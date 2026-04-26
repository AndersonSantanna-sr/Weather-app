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

const LocationPermissionDenied: FC<Props> = ({ onRetry }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.CLOUDY];

  return (
    <LinearGradient
      colors={gradient.colors}
      locations={[0, 1]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Ionicons
          name="location-off"
          size={80}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.title}>Location access denied</Text>
        <Text style={styles.subtitle}>
          Enable location in settings or search for a city manually.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Open Settings</Text>
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

export default LocationPermissionDenied;
