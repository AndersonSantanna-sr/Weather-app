import { ThunderstormsJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/store/useWeatherThemeStore';
import { BlurView } from 'expo-blur';
import React, { type FC } from 'react';
import { Text } from 'react-native';
import { createStyles } from './styles';

type Props = {
  time: string;
  icon: string;
  temperature: string;
};

const HourlyForecastCard: FC<Props> = ({ time, icon, temperature }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <BlurView intensity={20} tint="light" style={styles.container}>
      <Text style={{ color: textColor }}>{temperature}</Text>
      <Icon source={ThunderstormsJson} />
      <Text style={{ color: subtextColor }}>{time}</Text>
    </BlurView>
  );
};

export default HourlyForecastCard;
