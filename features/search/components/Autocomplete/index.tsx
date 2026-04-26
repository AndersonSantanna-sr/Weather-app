import If from '@/shared/components/If';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSearch } from '../../hooks/useSearch';
import { useSearchStore } from '../../stores/useSearchStore';
import { createStyles } from './styles';

const Autocomplete: FC = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: results = [], isFetching } = useSearch(debouncedQuery);
  const { addRecentSearch, setSelectedQuery } = useSearchStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputValue), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (location: (typeof results)[number]) => {
    addRecentSearch({ ...location, searchedAt: Date.now() });
    setSelectedQuery(`${location.lat},${location.lon}`);
    router.back();
  };

  return (
    <BlurView intensity={40} tint="light">
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="search" size={18} color="#444444" />
        </View>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Search"
          style={styles.input}
          autoFocus
        />
        <If condition={isFetching && debouncedQuery.length >= 3}>
          <ActivityIndicator size="small" color="#444444" style={{ marginRight: 8 }} />
        </If>
      </View>
      <If condition={!!debouncedQuery.length && results.length > 0}>
        <View style={styles.optionContainer}>
          {results.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.optionText}>
                {item.name}, {item.region}, {item.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </If>
    </BlurView>
  );
};

export default Autocomplete;
