import ForecastCard from '@/shared/components/ForecastCard';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatDate, getWeekday } from '@/shared/utils/dateHelpers';
import React, { type FC } from 'react';
import { Text, View } from 'react-native';
import { type WeatherForecastDay } from '../../types/weather';
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
      <Text style={[styles.subtitle, { color: subtextColor }]}>Next {data.length} Days</Text>
      {data.map((item, index) => (
        <React.Fragment key={item.date}>
          <ForecastCard
            title={getWeekday(item.date)}
            subtitle={formatDate(item.date)}
            icon={item.day.condition.code}
            isDay
            avgTemperature={item.day.avgtemp_c}
          />
          {index < data.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default SectionDays;
