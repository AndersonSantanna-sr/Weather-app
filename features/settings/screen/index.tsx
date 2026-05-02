import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '@/shared/types/units';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
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
  { value: WindSpeedUnit.MS, label: 'm/s' },
];

const timeFormatOptions = [
  { value: TimeFormat.H24, label: '24 hours' },
  { value: TimeFormat.H12, label: '12 hours (AM/PM)' },
];

const rainThresholdOptions = [
  { value: 30, label: '30%' },
  { value: 50, label: '50%' },
  { value: 70, label: '70%' },
  { value: 90, label: '90%' },
];

const Settings: FC = () => {
  const appTheme = useAppTheme();
  const styles = useMemo(() => createStyles(appTheme), [appTheme]);
  const {
    temperatureUnit,
    windSpeedUnit,
    timeFormat,
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    setTemperatureUnit,
    setWindSpeedUnit,
    setTimeFormat,
    setRainAlertEnabled,
    setRainAlertThreshold,
    setDailySummaryEnabled,
    setTemperatureAlertEnabled,
    setTemperatureAlertThreshold,
  } = useSettings();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.DRIZZLE];

  const temperatureAlertThresholdOptions: Options<number>[] = useMemo(() => {
    const celsiusValues = [30, 35, 40, 45];
    return celsiusValues.map((c) => ({
      value: c,
      label:
        temperatureUnit === TemperatureUnit.FAHRENHEIT
          ? `${((c * 9) / 5 + 32).toFixed(0)}°F`
          : `${c}°C`,
    }));
  }, [temperatureUnit]);

  const handleSelectTemperatureUnit = (option: Options<TemperatureUnit>) =>
    setTemperatureUnit(option.value);
  const handleSelectWindSpeedUnit = (option: Options<WindSpeedUnit>) =>
    setWindSpeedUnit(option.value);
  const handleSelectTimeFormat = (option: Options<TimeFormat>) => setTimeFormat(option.value);
  const handleSelectRainThreshold = (option: Options<number>) =>
    setRainAlertThreshold(option.value);
  const handleSelectTemperatureThreshold = (option: Options<number>) =>
    setTemperatureAlertThreshold(option.value);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
      />
      <View style={{ zIndex: 8 }}>
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
      <View style={{ zIndex: 7 }}>
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
      <View style={{ zIndex: 6 }}>
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

      <Text style={styles.sectionTitle}>Notificações</Text>

      <View style={{ zIndex: 5 }}>
        <ItemSettings
          title="Alerta de chuva"
          icon={<MaterialCommunityIcons name="weather-rainy" size={24} color="black" />}
          input={<Switch value={rainAlertEnabled} onValueChange={setRainAlertEnabled} />}
        />
      </View>
      {rainAlertEnabled && (
        <View style={{ zIndex: 4 }}>
          <ItemSettings
            title="Limite de chuva"
            icon={<MaterialCommunityIcons name="percent" size={24} color="black" />}
            input={
              <SelectOption
                value={rainAlertThreshold}
                options={rainThresholdOptions}
                onSelect={handleSelectRainThreshold}
              />
            }
          />
        </View>
      )}
      <View style={{ zIndex: 3 }}>
        <ItemSettings
          title="Resumo diário"
          icon={<MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="black" />}
          input={<Switch value={dailySummaryEnabled} onValueChange={setDailySummaryEnabled} />}
        />
      </View>
      <View style={{ zIndex: 2 }}>
        <ItemSettings
          title="Alerta de temperatura"
          icon={<MaterialCommunityIcons name="thermometer" size={24} color="black" />}
          input={
            <Switch value={temperatureAlertEnabled} onValueChange={setTemperatureAlertEnabled} />
          }
        />
      </View>
      {temperatureAlertEnabled && (
        <View style={{ zIndex: 1 }}>
          <ItemSettings
            title="Limite de temperatura"
            icon={<MaterialCommunityIcons name="thermometer-high" size={24} color="black" />}
            input={
              <SelectOption
                value={temperatureAlertThreshold}
                options={temperatureAlertThresholdOptions}
                onSelect={handleSelectTemperatureThreshold}
              />
            }
          />
        </View>
      )}
    </View>
  );
};

export default Settings;
