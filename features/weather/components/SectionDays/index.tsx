import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/store/useWeatherThemeStore';
import React, { type FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import { type WeatherForecastDay } from '../../types/weather';
import DailyForecastCard from '../DailyForecastCard';
import { createStyles } from './styles';

type Props = {
  data: WeatherForecastDay[];
};

const SectionDays: FC<Props> = ({ data }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: subtextColor }]}>Next 7 Days</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.date}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <DailyForecastCard
            date={item.date}
            icon={item.day.condition.icon}
            avgTemperature={item.day.avgtemp_c}
          />
        )}
      />
    </View>
  );
};

export default SectionDays;
