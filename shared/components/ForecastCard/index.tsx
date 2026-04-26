import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
import { BlurView } from 'expo-blur';
import { isEmpty } from 'lodash';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import If from '../If';
import WeatherIcon from '../WeatherIcon';
import { createStyles } from './styles';

type Props = {
  title: string;
  subtitle?: string;
  isDay?: boolean;
  icon: number;
  avgTemperature: number;
};

const ForecastCard: FC<Props> = ({ title, subtitle, icon, avgTemperature, isDay }) => {
  const theme = useAppTheme();
  const temperatureUnit = useSettings((state) => state.temperatureUnit);
  const styles = createStyles(theme);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <BlurView intensity={70} tint="light" style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={[styles.weekdayText, { color: textColor }]}>{title}</Text>
        <If condition={!isEmpty(subtitle)}>
          <Text style={[styles.dateText, { color: subtextColor }]}>{subtitle}</Text>
        </If>
      </View>
      <View style={styles.flexContainer}>
        <Text style={[styles.temperatureText, { color: textColor }]}>
          {getTemperatureUnitLabel(Number(avgTemperature.toFixed(0)), temperatureUnit)}
        </Text>
      </View>
      <View style={styles.flexContainer}>
        <WeatherIcon iconName={mapCodeToCondition(icon, !!isDay)} />
      </View>
    </BlurView>
  );
};

export default ForecastCard;
