import Menu from '@/assets/icons/Menu';
import Settings from '@/assets/icons/Settings';
import type { WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatDate, getWeekday } from '@/shared/utils/dateHelpers';
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
  conditionLabel: string;
  hiTempC: number;
  loTempC: number;
  topInset: number;
};

const Header: FC<Props> = ({
  weatherCondition,
  weatherData,
  conditionLabel,
  hiTempC,
  loTempC,
  topInset,
}) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useRouter();
  const { temperatureUnit } = useSettings();
  const { heroText, heroSub, chip, border } = useWeatherThemeStore((s) => s);

  const localtime = weatherData?.location.localtime;
  const formatted = localtime
    ? localtime.split(' ')[0]
    : (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })();

  const cityName = weatherData?.location.name ?? '';
  const iconColor = 'rgba(255,255,255,0.92)';

  const handleNavigationSettings = () => navigation.push('/settings');
  const handleNavigationSearch = () => navigation.push('/search');

  return (
    <View style={[styles.container, { paddingTop: topInset + 8 }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleNavigationSettings}
          style={[styles.glassButton, { backgroundColor: chip, borderColor: border }]}
          activeOpacity={0.7}
        >
          <Settings color={iconColor} width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigationSearch}
          style={[styles.glassButton, { backgroundColor: chip, borderColor: border }]}
          activeOpacity={0.7}
        >
          <Menu color={iconColor} width={22} height={22} />
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={[styles.cityName, { color: heroText }]} numberOfLines={1}>
          {cityName}
        </Text>
        <Text style={[styles.dateText, { color: heroSub }]}>
          {formatDate(formatted)}. {getWeekday(formatted)}
        </Text>
        <View style={styles.iconContainer}>
          <WeatherIcon iconName={weatherCondition} size={130} />
        </View>
        <Text style={[styles.temperature, { color: heroText }]}>
          {getTemperatureUnitLabel(weatherData?.current.temp_c || 0, temperatureUnit)}
        </Text>
        <Text style={[styles.conditionLabel, { color: heroText }]}>{conditionLabel}</Text>
        <Text style={[styles.hiLo, { color: heroSub }]}>
          {`H: ${getTemperatureUnitLabel(hiTempC, temperatureUnit)}  ·  L: ${getTemperatureUnitLabel(loTempC, temperatureUnit)}`}
        </Text>
      </View>
    </View>
  );
};

export default Header;
