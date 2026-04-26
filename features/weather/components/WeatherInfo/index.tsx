import { HumidityJson, ThermometerJson, WindJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
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
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Icon source={WindJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Wind now</Text>
        <Text style={[styles.valueText, { color: textColor }]}>{weatherCurrent?.wind_kph} km</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={ThermometerJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Feels</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {getTemperatureUnitLabel(weatherCurrent?.feelslike_c || 0, temperatureUnit)}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={HumidityJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Humidity</Text>
        <Text style={[styles.valueText, { color: textColor }]}>{weatherCurrent?.humidity}%</Text>
      </View>
    </View>
  );
};

export default WeatherInfo;
