import WeatherIcon from '@/shared/components/WeatherIcon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
import { BlurView } from 'expo-blur';
import React, { type FC } from 'react';
import { Text } from 'react-native';
import { createStyles } from './styles';

type Props = {
  time: string;
  iconCode: number;
  temperature: number;
  isDay?: boolean;
};

const HourlyForecastCard: FC<Props> = ({ time, iconCode, temperature, isDay }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const temperatureUnit = useSettings((state) => state.temperatureUnit);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <BlurView intensity={20} tint="light" style={styles.container}>
      <Text style={[styles.valueText, { color: textColor }]}>
        {getTemperatureUnitLabel(temperature, temperatureUnit)}
      </Text>
      <WeatherIcon iconName={mapCodeToCondition(iconCode, !!isDay)} />
      <Text style={[styles.subtitle, { color: subtextColor }]}>{time}</Text>
    </BlurView>
  );
};

export default HourlyForecastCard;
