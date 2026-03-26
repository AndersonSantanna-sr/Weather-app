import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { TemperatureUnit } from '@/shared/types/units';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import ItemSettings from '../components/ItemSettings';
import type { Options } from '../components/SelectOption';
import SelectOption from '../components/SelectOption';
import { createStyles } from './styles';

type Props = {};

const temperatureUnitOptions = [
  { value: TemperatureUnit.CELSIUS, label: 'Celsius (°C)' },
  { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' },
];

const Settings: FC<Props> = () => {
  const appTheme = useAppTheme();
  const styles = useMemo(() => createStyles(appTheme), [appTheme]);
  const { theme, temperatureUnit, locationServicesEnabled, setTemperatureUnit } = useSettings();
  const weatherCondition = WeatherCondition.DRIZZLE;
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const handleSelectTemperatureUnit = (option: Options<TemperatureUnit>) => {
    setTemperatureUnit(option.value);
  };

  const renderSelectTemperatureUnit = () => {
    return (
      <SelectOption
        value={temperatureUnit}
        options={temperatureUnitOptions}
        onSelect={handleSelectTemperatureUnit}
      />
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        // children={<Header weatherCondition={weatherCondition} />}
      />
      {/* <ItemSettings
        title="Theme"
        description={theme}
        icon={<MaterialCommunityIcons name="theme-light-dark" size={24} color="black" />}
        input={<Switch />}
      /> */}
      <ItemSettings
        title="Temperature Unit"
        icon={<MaterialCommunityIcons name="weather-sunny" size={24} color="black" />}
        input={renderSelectTemperatureUnit()}
      />
      <ItemSettings
        title="Location Services"
        description={locationServicesEnabled ? 'Enabled' : 'Disabled'}
        icon={<MaterialCommunityIcons name="map-marker-radius" size={24} color="black" />}
        input={<Switch />}
      />
    </View>
  );
};

export default Settings;
