# Search API & Recent Searches — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the search screen to the WeatherAPI search endpoint, persist the last 5 searched cities, and allow selecting a city to override the home screen weather temporarily.

**Architecture:** New `features/search/` modules (type, api, hook, store) follow the feature-based pattern already used by `features/weather/`. The Autocomplete component is updated to use real data with 400ms debounce. The home screen reads `selectedQuery` from the search store as an override over GPS.

**Tech Stack:** React Native, Expo, TypeScript, Axios, @tanstack/react-query, Zustand + MMKV persist, expo-router

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `features/search/types/search.ts` | `SearchLocation` type |
| Create | `features/search/api/searchApi.ts` | `getForecastSearch(query)` API call |
| Create | `features/search/hooks/useSearch.ts` | React Query hook |
| Create | `features/search/stores/useSearchStore.ts` | Zustand store (selectedQuery + recentSearches) |
| Modify | `shared/utils/dateHelpers.ts` | Add `formatRelativeTime(timestamp)` |
| Modify | `features/search/components/Autocomplete/index.tsx` | Connect to API, debounce, on-select handler |
| Modify | `features/search/screen/index.tsx` | Connect recently seen cards to store |
| Modify | `app/index.tsx` | Read `selectedQuery` as override for weather query |

---

### Task 1: `SearchLocation` type

**Files:**
- Create: `features/search/types/search.ts`

- [ ] **Step 1: Create the type file**

```ts
export type SearchLocation = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
  searchedAt: number;
};
```

> `searchedAt` is `Date.now()` ms, added when saving to the store (not returned by API).

- [ ] **Step 2: Commit**

```bash
git add features/search/types/search.ts
git commit -m "feat: add SearchLocation type"
```

---

### Task 2: Search API

**Files:**
- Create: `features/search/api/searchApi.ts`

Context: `lib/api/client.ts` exports an `axios` instance with `baseURL: 'http://api.weatherapi.com/v1'`. The API key env var is `EXPO_PUBLIC_API_KEY`. The search endpoint is `GET /search.json?q=<query>&key=<key>` and returns `SearchLocation[]` (without `searchedAt` — that's added by the store).

- [ ] **Step 1: Create the API file**

```ts
import { api } from '@/lib/api/client';
import type { SearchLocation } from '../types/search';

export const getForecastSearch = async (query: string): Promise<Omit<SearchLocation, 'searchedAt'>[]> => {
  const response = await api.get('/search.json', {
    params: {
      q: query,
      key: process.env.EXPO_PUBLIC_API_KEY,
    },
  });
  return response.data;
};
```

- [ ] **Step 2: Commit**

```bash
git add features/search/api/searchApi.ts
git commit -m "feat: add search API call"
```

---

### Task 3: `useSearch` hook

**Files:**
- Create: `features/search/hooks/useSearch.ts`

Context: `features/weather/hooks/useForecast.ts` uses `@tanstack/react-query` with `useQuery`. Follow the same pattern.

- [ ] **Step 1: Create the hook**

```ts
import { useQuery } from '@tanstack/react-query';
import { getForecastSearch } from '../api/searchApi';
import type { SearchLocation } from '../types/search';

export const useSearch = (query: string) => {
  return useQuery<Omit<SearchLocation, 'searchedAt'>[]>({
    queryKey: ['search', query],
    queryFn: () => getForecastSearch(query),
    enabled: query.length >= 3,
    staleTime: 30_000,
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add features/search/hooks/useSearch.ts
git commit -m "feat: add useSearch React Query hook"
```

---

### Task 4: `useSearchStore`

**Files:**
- Create: `features/search/stores/useSearchStore.ts`

Context:
- `lib/storage/storage.ts` exports `zustandStorage` (MMKV on native, localStorage on web) for use with Zustand `persist` middleware.
- `features/weather/stores/useWeatherForecastStore.ts` uses `create` from `zustand` — follow the same import pattern.
- Use `partialize` to persist only `recentSearches`, NOT `selectedQuery` (ephemeral).
- `addRecentSearch`: prepend the new location, deduplicate by `id`, trim to max 5.

- [ ] **Step 1: Create the store**

```ts
import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchLocation } from '../types/search';

interface SearchState {
  selectedQuery: string | null;
  recentSearches: SearchLocation[];
  setSelectedQuery: (query: string | null) => void;
  addRecentSearch: (location: SearchLocation) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      selectedQuery: null,
      recentSearches: [],
      setSelectedQuery: (query) => set({ selectedQuery: query }),
      addRecentSearch: (location) =>
        set((state) => {
          const filtered = state.recentSearches.filter((r) => r.id !== location.id);
          return { recentSearches: [location, ...filtered].slice(0, 5) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-store',
      storage: zustandStorage,
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add features/search/stores/useSearchStore.ts
git commit -m "feat: add useSearchStore with MMKV persistence"
```

---

### Task 5: `formatRelativeTime` helper

**Files:**
- Modify: `shared/utils/dateHelpers.ts`

Context: The file already exports `getWeekday`, `formatDate`, `formatHour`, `getNextHours`. Append the new function at the end.

- [ ] **Step 1: Append `formatRelativeTime` to `shared/utils/dateHelpers.ts`**

Add at the end of the file:

```ts
export const formatRelativeTime = (timestamp: number): string => {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'ontem';
  return `${diffDays} dias atrás`;
};
```

- [ ] **Step 2: Commit**

```bash
git add shared/utils/dateHelpers.ts
git commit -m "feat: add formatRelativeTime helper"
```

---

### Task 6: Update `Autocomplete` component

**Files:**
- Modify: `features/search/components/Autocomplete/index.tsx`

Context: Current component uses mock data and local `useState` + `useMemo`. Replace with:
- `inputValue` state for the text input
- `debouncedQuery` state (400ms debounce via `useEffect`)
- `useSearch(debouncedQuery)` for API results
- `useSearchStore` for `addRecentSearch` + `setSelectedQuery`
- `useRouter` to navigate back on selection
- Show `ActivityIndicator` while `isFetching && debouncedQuery.length >= 3`
- Pressing an item calls `addRecentSearch({ ...location, searchedAt: Date.now() })`, `setSelectedQuery(`${location.lat},${location.lon}`)`, then `router.back()`

The existing styles file (`features/search/components/Autocomplete/styles.tsx`) already has `optionContainer`, `optionItem`, `optionText`, `inputContainer`, `iconContainer`, `input` — reuse them all.

- [ ] **Step 1: Replace `Autocomplete/index.tsx` content**

```tsx
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
            <TouchableOpacity key={item.id} style={styles.optionItem} onPress={() => handleSelect(item)}>
              <Text style={styles.optionText}>{item.name}, {item.region}, {item.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </If>
    </BlurView>
  );
};

export default Autocomplete;
```

- [ ] **Step 2: Commit**

```bash
git add features/search/components/Autocomplete/index.tsx
git commit -m "feat: connect Autocomplete to search API with debounce"
```

---

### Task 7: Update `Search` screen

**Files:**
- Modify: `features/search/screen/index.tsx`

Context: Current screen shows hardcoded `weather` array with `ForecastCard`. Replace with `recentSearches` from `useSearchStore`. Each card: `title=location.name`, `subtitle=formatRelativeTime(location.searchedAt)`, `avgTemperature=0`, `icon=0`, wrapped in `TouchableOpacity` that calls `setSelectedQuery(`${lat},${lon}`)` + `router.push('/')`.

Current file imports to keep: `ForecastCard`, `WEATHER_GRADIENTS`, `WeatherCondition`, `useAppTheme`, `Ionicons`, `LinearGradient`, `useRouter`, `SafeAreaView`, `Autocomplete`, `createStyles`.

- [ ] **Step 1: Replace `features/search/screen/index.tsx` content**

```tsx
import ForecastCard from '@/shared/components/ForecastCard';
import { WEATHER_GRADIENTS, WeatherCondition } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { formatRelativeTime } from '@/shared/utils/dateHelpers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Autocomplete } from '../components';
import { useSearchStore } from '../stores/useSearchStore';
import { createStyles } from './styles';

const Search: FC = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.DRIZZLE];
  const { recentSearches, setSelectedQuery } = useSearchStore();

  const handleRecentPress = (lat: number, lon: number) => {
    setSelectedQuery(`${lat},${lon}`);
    router.push('/');
  };

  const handleNavigationBack = () => router.back();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
      />
      <View style={styles.autocompleteContainer}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.background.secondary} />
        </TouchableOpacity>
        <Autocomplete />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Recently seen:</Text>
        </View>
        {recentSearches.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.forecastCardContainer}
            onPress={() => handleRecentPress(item.lat, item.lon)}
          >
            <ForecastCard
              title={item.name}
              subtitle={formatRelativeTime(item.searchedAt)}
              avgTemperature={0}
              icon={0}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Search;
```

- [ ] **Step 2: Commit**

```bash
git add features/search/screen/index.tsx
git commit -m "feat: connect search screen to recent searches store"
```

---

### Task 8: Wire `selectedQuery` into home screen

**Files:**
- Modify: `app/index.tsx`

Context: Current file at line 21 calls `useForecast(locationQuery)` directly. We need to read `selectedQuery` from `useSearchStore` and use it as an override: `const activeQuery = selectedQuery || locationQuery`.

- [ ] **Step 1: Update `app/index.tsx`**

Replace the relevant lines. Final file:

```tsx
import {
  LocationPermissionDenied,
  SectionDays,
  SectionTime,
  WeatherInfo,
} from '@/features/weather/components';
import Header from '@/features/weather/components/Header';
import { useForecast } from '@/features/weather/hooks/useForecast';
import { useUserLocation } from '@/features/weather/hooks/useUserLocation';
import { useSearchStore } from '@/features/search/stores/useSearchStore';
import { WEATHER_GRADIENTS } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const { locationQuery, permissionDenied, retry } = useUserLocation();
  const { selectedQuery } = useSearchStore();
  const activeQuery = selectedQuery || locationQuery;
  const { data: weatherData, isLoading } = useForecast(activeQuery);
  const weatherCondition = mapCodeToCondition(
    weatherData?.current?.condition.code || 0,
    !!weatherData?.current.is_day
  );
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (permissionDenied) return <LocationPermissionDenied onRetry={retry} />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header weatherData={weatherData} weatherCondition={weatherCondition} />}
      />
      <BlurView intensity={70} tint="light" style={styles.cloudEffect}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <WeatherInfo weatherCurrent={weatherData?.current} />
          <SectionTime
            data={getNextHours(
              weatherData?.forecast?.forecastday[0].hour || [],
              weatherData?.forecast?.forecastday[1].hour || []
            )}
          />
          <SectionDays data={weatherData?.forecast?.forecastday || []} />
        </ScrollView>
      </BlurView>
      <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/index.tsx
git commit -m "feat: use selectedQuery from search store as weather query override"
```
