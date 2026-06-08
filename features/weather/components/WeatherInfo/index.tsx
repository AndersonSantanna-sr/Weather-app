import { HumidityJson, ThermometerJson, WindJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatWindSpeed, getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import type { WeatherCurrent } from '../../types/weather';
import { createStyles } from './styles';

type Props = {
  weatherCurrent?: WeatherCurrent;
};

const WeatherInfo: FC<Props> = ({ weatherCurrent }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const temperatureUnit = useSettings((state) => state.temperatureUnit);
  const windSpeedUnit = useSettings((state) => state.windSpeedUnit);
  const { textColor, subtextColor, faintColor, surfaceStrong, border, divider } =
    useWeatherThemeStore((s) => s);

  return (
    <View style={[styles.card, { backgroundColor: surfaceStrong, borderColor: border }]}>
      <View style={styles.metric}>
        <Icon source={WindJson} />
        <Text style={[styles.label, { color: subtextColor }]}>Wind</Text>
        <Text style={[styles.value, { color: textColor }]}>
          {formatWindSpeed(weatherCurrent?.wind_kph ?? 0, windSpeedUnit)}
        </Text>
        <Text style={[styles.sub, { color: faintColor }]}>{weatherCurrent?.wind_dir ?? ''}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: divider }]} />

      <View style={styles.metric}>
        <Icon source={ThermometerJson} />
        <Text style={[styles.label, { color: subtextColor }]}>Feels Like</Text>
        <Text style={[styles.value, { color: textColor }]}>
          {getTemperatureUnitLabel(weatherCurrent?.feelslike_c || 0, temperatureUnit)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: divider }]} />

      <View style={styles.metric}>
        <Icon source={HumidityJson} />
        <Text style={[styles.label, { color: subtextColor }]}>Humidity</Text>
        <Text style={[styles.value, { color: textColor }]}>{weatherCurrent?.humidity}%</Text>
      </View>
    </View>
  );
};

export default WeatherInfo;
