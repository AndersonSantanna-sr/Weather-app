import { ThunderstormsJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { formatDate, getWeekday } from '@/shared/utils/dateHelpers';
import { useWeatherThemeStore } from '@/store/useWeatherThemeStore';
import { BlurView } from 'expo-blur';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import { createStyles } from './styles';

type Props = {
  date: string;
  icon: string;
  avgTemperature: number;
};

const DailyForecastCard: FC<Props> = ({ date, icon, avgTemperature }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <BlurView intensity={20} tint="light" style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={[styles.weekdayText, { color: textColor }]}>{getWeekday(date)}</Text>
        <Text style={[styles.dateText, { color: subtextColor }]}>{formatDate(date)}</Text>
      </View>
      <View style={styles.flexContainer}>
        <Text style={[styles.temperatureText, { color: textColor }]}>
          {avgTemperature.toFixed(0)}°C
        </Text>
      </View>
      <View style={styles.flexContainer}>
        <Icon source={ThunderstormsJson} />
      </View>
    </BlurView>
  );
};

export default DailyForecastCard;
