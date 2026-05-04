import Menu from '@/assets/icons/Menu';
import Settings from '@/assets/icons/Settings';
import type { WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { formatDate, getWeekday } from '@/shared/utils/dateHelpers';
import { truncate } from '@/shared/utils/stringHelpers';
import { getTemperatureUnitLabel } from '@/shared/utils/unitHelpers';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import WeatherIcon from '../../../../shared/components/WeatherIcon';
import type { WeatherData } from '../../types/weather';
import { createStyles } from './styles';

type Props = {
  weatherCondition: WeatherCondition;
  weatherData?: WeatherData;
};

const Header: FC<Props> = ({ weatherCondition, weatherData }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useRouter();
  const { temperatureUnit } = useSettings();
  const localtime = weatherData?.location.localtime;
  const formatted = localtime
    ? localtime.split(' ')[0]
    : (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })();
  const cityName = truncate(weatherData?.location.name ?? '', 14);
  const handleNavigationSettings = () => navigation.push('/settings');
  const handleNavigationSearch = () => navigation.push('/search');

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={handleNavigationSettings}>
          <Settings color="white" width={20} height={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handleNavigationSearch}>
          <Menu color="white" width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.temp}>
          {getTemperatureUnitLabel(weatherData?.current.temp_c || 0, temperatureUnit)}
        </Text>
        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <Text style={styles.title}>{cityName}</Text>
          <Text style={styles.description}>
            {formatDate(formatted)}. {getWeekday(formatted)}
          </Text>
        </View>
      </View>
      <View style={styles.weatherIconContainer}>
        <WeatherIcon iconName={weatherCondition} size={145} />
      </View>
    </View>
  );
};

export default Header;
