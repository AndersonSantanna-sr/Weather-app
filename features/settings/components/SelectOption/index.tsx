import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import type { ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { createStyles } from './styles';

export type Options<T> = {
  value: T;
  label: string;
};

type SelectOptionProps<T> = {
  value: T;
  contentStyle?: ViewStyle;
  options?: Options<T>[];
  onSelect?: (value: Options<T>) => void;
};

const SelectOption = <T,>({
  value,
  contentStyle,
  options = [],
  onSelect,
}: SelectOptionProps<T>) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const selected = options.find((o) => o.value === value);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectOption = (value: Options<T>) => {
    setDropdownOpen(false);
    onSelect?.(value);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.container, contentStyle]}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
          {selected?.label}
        </Text>
        <Entypo
          name={dropdownOpen ? 'chevron-small-up' : 'chevron-small-down'}
          size={24}
          color="black"
        />
      </Pressable>

      {dropdownOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => {
            return (
              <Pressable
                key={index}
                style={[
                  styles.optionItem,
                  selected?.value === option.value && styles.optionItemSelected,
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected?.value === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default SelectOption;
