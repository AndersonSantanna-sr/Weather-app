import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { BlurView } from 'expo-blur';
import { isEmpty } from 'lodash';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import If from '../If';
import { createStyles } from './styles';

type Props = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  avgTemperature: number;
};

const ForecastCard: FC<Props> = ({ title, subtitle, icon, avgTemperature }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <BlurView intensity={20} tint="light" style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={[styles.weekdayText, { color: textColor }]}>{title}</Text>
        <If condition={!isEmpty(subtitle)}>
          <Text style={[styles.dateText, { color: subtextColor }]}>{subtitle}</Text>
        </If>
      </View>
      <View style={styles.flexContainer}>
        <Text style={[styles.temperatureText, { color: textColor }]}>
          {avgTemperature.toFixed(0)}°C
        </Text>
      </View>
      <View style={styles.flexContainer}>{icon}</View>
    </BlurView>
  );
};

export default ForecastCard;
