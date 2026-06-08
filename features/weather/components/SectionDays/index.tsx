import WeatherIcon from '@/shared/components/WeatherIcon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatDate, getWeekday } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
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
  const { subtextColor, textColor, faintColor, surfaceStrong, border, divider } =
    useWeatherThemeStore((s) => s);
  const temperatureUnit = useSettings((s) => s.temperatureUnit);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: subtextColor }]}>{data.length}-Day Forecast</Text>
      <View style={[styles.surface, { backgroundColor: surfaceStrong, borderColor: border }]}>
        {data.map((item, index) => {
          const pop = item.day.daily_chance_of_rain;
          const condition = mapCodeToCondition(item.day.condition.code, true);
          return (
            <View
              key={item.date}
              style={[styles.row, index > 0 && { borderTopWidth: 0.6, borderTopColor: divider }]}
            >
              <View style={styles.dayBlock}>
                <Text style={[styles.dayText, { color: textColor }]}>
                  {index === 0 ? 'Today' : getWeekday(item.date)}
                </Text>
                <Text style={[styles.dateText, { color: faintColor }]}>
                  {formatDate(item.date)}
                </Text>
              </View>
              <View style={styles.iconBlock}>
                <WeatherIcon iconName={condition} size={28} />
              </View>
              <Text
                style={[
                  styles.popText,
                  { color: pop >= 50 ? '#3A7BD0' : faintColor, opacity: pop > 0 ? 1 : 0 },
                ]}
              >
                {pop}%
              </Text>
              <Text style={[styles.loTemp, { color: faintColor }]}>
                {getTemperatureUnitLabel(Math.round(item.day.mintemp_c), temperatureUnit)}
              </Text>
              <Text style={[styles.hiTemp, { color: textColor }]}>
                {getTemperatureUnitLabel(Math.round(item.day.maxtemp_c), temperatureUnit)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SectionDays;
