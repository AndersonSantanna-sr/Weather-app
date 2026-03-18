import { formatHour } from '@/utils/dateHelpers';
import React, { type FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HourlyForecastCard } from '..';
import { type WeatherHour } from '../../types/weather';
import { styles } from './styles';

type Props = {
  data: WeatherHour[];
};

const SectionTime: FC<Props> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Next hours</Text>
      <FlatList
        data={data}
        horizontal
        scrollEnabled
        keyExtractor={(item) => item.time}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        renderItem={({ item }) => (
          <HourlyForecastCard
            temperature={String(item.temp_c)}
            icon={item.condition.icon}
            time={formatHour(item.time)}
          />
        )}
      />
    </View>
  );
};

export default SectionTime;
