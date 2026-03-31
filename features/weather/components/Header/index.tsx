import Menu from '@/assets/icons/Menu';
import Settings from '@/assets/icons/Settings';
import type { WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import WeatherIcon from '../../../../shared/components/WeatherIcon';
import { createStyles } from './styles';

type Props = {
  weatherCondition: WeatherCondition;
};

const Header: FC<Props> = ({ weatherCondition }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useRouter();

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
        <Text style={styles.temp}>29°C</Text>
        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <Text style={styles.title}>Indaiatuba</Text>
          <Text style={styles.description}>10 March, Tuesday</Text>
        </View>
      </View>
      <View style={styles.weatherIconContainer}>
        <WeatherIcon iconName={weatherCondition} size={145} />
      </View>
    </View>
  );
};

export default Header;
