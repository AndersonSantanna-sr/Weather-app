import If from '@/shared/components/If';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { FC } from 'react';
import React, { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { createStyles } from './styles';

type Props = {};

const Autocomplete: FC<Props> = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [textValue, setTextValue] = useState('');
  const data = useMemo(
    () =>
      [
        { id: '1', name: 'New York' },
        { id: '2', name: 'London' },
        { id: '3', name: 'Tokyo' },
      ].filter(({ name }) => name.toLowerCase().includes(textValue.toLowerCase())),
    [textValue]
  );
  return (
    <BlurView intensity={40} tint="light">
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="search" size={18} color="#444444" />
        </View>
        <TextInput
          value={textValue}
          onChangeText={setTextValue}
          placeholder="Search"
          style={styles.input}
        />
      </View>
      <If condition={!!textValue.length}>
        <View style={styles.optionContainer}>
          {data.map((item) => (
            <View key={item.id} style={styles.optionItem}>
              <Text style={styles.optionText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </If>
    </BlurView>
  );
};

export default Autocomplete;
