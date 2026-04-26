import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatHour } from '@/shared/utils/dateHelpers';
import React, { type FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HourlyForecastCard } from '..';
import { type WeatherHour } from '../../types/weather';
import { createStyles } from './styles';

type Props = {
  data: WeatherHour[];
};

const SectionTime: FC<Props> = ({ data }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: subtextColor }]}>Next hours</Text>
      <FlatList
        data={data}
        horizontal
        scrollEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.time}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <HourlyForecastCard
            temperature={Number(item.temp_c.toFixed(0))}
            iconCode={item.condition.code}
            isDay={Boolean(item.is_day)}
            time={formatHour(item.time)}
          />
        )}
      />
    </View>
  );
};

export default SectionTime;
