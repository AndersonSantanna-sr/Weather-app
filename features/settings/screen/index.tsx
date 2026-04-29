import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '@/shared/types/units';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import ItemSettings from '../components/ItemSettings';
import type { Options } from '../components/SelectOption';
import SelectOption from '../components/SelectOption';
import { createStyles } from './styles';

const temperatureUnitOptions = [
  { value: TemperatureUnit.CELSIUS, label: 'Celsius (°C)' },
  { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' },
];

const windSpeedUnitOptions = [
  { value: WindSpeedUnit.KPH, label: 'km/h' },
  { value: WindSpeedUnit.MPH, label: 'mph' },
  { value: WindSpeedUnit.MS,  label: 'm/s' },
];

const timeFormatOptions = [
  { value: TimeFormat.H24, label: '24 hours' },
  { value: TimeFormat.H12, label: '12 hours (AM/PM)' },
];

const Settings: FC = () => {
  const appTheme = useAppTheme();
  const styles = useMemo(() => createStyles(appTheme), [appTheme]);
  const {
    temperatureUnit,
    windSpeedUnit,
    timeFormat,
    setTemperatureUnit,
    setWindSpeedUnit,
    setTimeFormat,
  } = useSettings();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.DRIZZLE];

  const handleSelectTemperatureUnit = (option: Options<TemperatureUnit>) =>
    setTemperatureUnit(option.value);
  const handleSelectWindSpeedUnit = (option: Options<WindSpeedUnit>) =>
    setWindSpeedUnit(option.value);
  const handleSelectTimeFormat = (option: Options<TimeFormat>) => setTimeFormat(option.value);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
      />
      <View style={{ zIndex: 3 }}>
        <ItemSettings
          title="Temperature Unit"
          icon={<MaterialCommunityIcons name="weather-sunny" size={24} color="black" />}
          input={
            <SelectOption
              value={temperatureUnit}
              options={temperatureUnitOptions}
              onSelect={handleSelectTemperatureUnit}
            />
          }
        />
      </View>
      <View style={{ zIndex: 2 }}>
        <ItemSettings
          title="Wind Speed Unit"
          icon={<MaterialCommunityIcons name="weather-windy" size={24} color="black" />}
          input={
            <SelectOption
              value={windSpeedUnit}
              options={windSpeedUnitOptions}
              onSelect={handleSelectWindSpeedUnit}
            />
          }
        />
      </View>
      <View style={{ zIndex: 1 }}>
        <ItemSettings
          title="Time Format"
          icon={<MaterialCommunityIcons name="clock-outline" size={24} color="black" />}
          input={
            <SelectOption
              value={timeFormat}
              options={timeFormatOptions}
              onSelect={handleSelectTimeFormat}
            />
          }
        />
      </View>
    </View>
  );
};

export default Settings;
