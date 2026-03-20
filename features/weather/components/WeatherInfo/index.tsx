import { HumidityJson, ThermometerJson, WindJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import { createStyles } from './styles';

type Props = {};

const WeatherInfo: FC<Props> = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Icon source={WindJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Wind now</Text>
        <Text style={[styles.valueText, { color: textColor }]}>10 KM</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={ThermometerJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Feels</Text>
        <Text style={[styles.valueText, { color: textColor }]}>35°C</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={HumidityJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Humidity</Text>
        <Text style={[styles.valueText, { color: textColor }]}>90%</Text>
      </View>
    </View>
  );
};

export default WeatherInfo;
