import Menu from '@/assets/icons/Menu';
import Settings from '@/assets/icons/Settings';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import StatusIcon from '../StatusIcon';
import { styles } from './styles';

type Props = {};

const Header: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Settings color="white" width={20} height={20} />
        <Text style={styles.title}>Today</Text>
        <Menu color="white" width={24} height={24} />
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.temp}>29°C</Text>
        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          <Text style={styles.title}>Indaiatuba</Text>
          <Text style={styles.description}>10 March, Tuesday</Text>
        </View>
      </View>
      <StatusIcon />
    </View>
  );
};

export default Header;
