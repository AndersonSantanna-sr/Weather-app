import { useAppTheme } from '@/shared/hooks/useAppTheme';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from './styles';

type Props = {
  title: string;
  description?: string;
  input: React.ReactNode;
  icon: React.ReactNode;
};

const ItemSettings: FC<Props> = ({ title, description, input, icon }) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfoContainer}>
        {icon}
        <View>
          <Text style={styles.itemText}>{title}</Text>
          {description && <Text style={styles.itemDescription}>{description}</Text>}
        </View>
      </View>
      <View style={styles.itemInputContainer}>{input}</View>
    </View>
  );
};

export default ItemSettings;
