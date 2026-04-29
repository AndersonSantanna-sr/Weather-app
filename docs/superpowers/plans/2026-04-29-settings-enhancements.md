# Settings Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add wind speed unit and time format settings with MMKV persistence, wire them into WeatherInfo and SectionTime components, and clean up the Settings screen.

**Architecture:** New enums in `shared/types/units.ts` feed into `useSettings` (Zustand + MMKV persist). Components read the setting via a narrowed selector and pass it to a utility helper (`formatWindSpeed` / `formatHour`). Settings screen adds two `SelectOption` entries using the existing pattern.

**Tech Stack:** React Native, Expo SDK 55, TypeScript, Zustand, MMKV (via `zustandStorage` from `lib/storage/storage.ts`), `@expo/vector-icons` (MaterialCommunityIcons)

---

## File Map

| File | Action |
|------|--------|
| `shared/types/units.ts` | Modify — add `WindSpeedUnit`, `TimeFormat` enums |
| `shared/store/useSettings.ts` | Modify — enable persist, add new fields, remove unused fields |
| `shared/utils/unitHelpers.ts` | Modify — add `formatWindSpeed` |
| `shared/utils/dateHelpers.ts` | Modify — update `formatHour` to accept `TimeFormat` |
| `features/weather/components/WeatherInfo/index.tsx` | Modify — use `formatWindSpeed` |
| `features/weather/components/SectionTime/index.tsx` | Modify — pass `timeFormat` to `formatHour` |
| `features/settings/screen/index.tsx` | Modify — add 2 settings, remove Location Services |

---

## Task 1: Add WindSpeedUnit and TimeFormat enums

**Files:**
- Modify: `shared/types/units.ts`

**Context:** `TemperatureUnit` already lives here. Add the two new enums to the same file.

- [ ] **Step 1: Replace file content**

```ts
// shared/types/units.ts
export enum TemperatureUnit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit',
}

export enum WindSpeedUnit {
  KPH = 'kph',
  MPH = 'mph',
  MS  = 'ms',
}

export enum TimeFormat {
  H24 = '24h',
  H12 = '12h',
}
```

- [ ] **Step 2: Commit**

```bash
git add shared/types/units.ts
git commit -m "feat: add WindSpeedUnit and TimeFormat enums"
```

---

## Task 2: Update useSettings store

**Files:**
- Modify: `shared/store/useSettings.ts`

**Context:** Persistence is currently commented out. `zustandStorage` is available from `@/lib/storage/storage.ts`. Remove unused fields (`theme`, `toggleTheme`, `setTheme`, `locationServicesEnabled`, `setLocationServicesEnabled`, `hasHydrated`, `setHasHydrated`). Add `windSpeedUnit` and `timeFormat` with their setters. Enable `persist`.

- [ ] **Step 1: Replace file content**

```ts
// shared/store/useSettings.ts
import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '../types/units';

interface SettingsStore {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: TemperatureUnit.CELSIUS,
      windSpeedUnit: WindSpeedUnit.KPH,
      timeFormat: TimeFormat.H24,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setTimeFormat: (format) => set({ timeFormat: format }),
    }),
    {
      name: 'settings',
      storage: zustandStorage,
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add shared/store/useSettings.ts
git commit -m "feat: enable settings persistence, add windSpeedUnit and timeFormat"
```

---

## Task 3: Add formatWindSpeed helper and update formatHour

**Files:**
- Modify: `shared/utils/unitHelpers.ts`
- Modify: `shared/utils/dateHelpers.ts`

**Context:** `unitHelpers.ts` already has `getTemperatureUnitLabel`. `dateHelpers.ts` has `formatHour(datetime: string)` used by `SectionTime` — adding an optional second param keeps existing callers unchanged.

- [ ] **Step 1: Update unitHelpers.ts**

```ts
// shared/utils/unitHelpers.ts
import { TemperatureUnit, WindSpeedUnit } from '../types/units';

export const getTemperatureUnitLabel = (temperature: number, unit: TemperatureUnit): string => {
  if (unit === TemperatureUnit.CELSIUS) return String(temperature.toFixed(0)).concat('°C');
  return String((temperature * 9) / 5 + 32).concat('°F');
};

export const formatWindSpeed = (kph: number, unit: WindSpeedUnit): string => {
  if (unit === WindSpeedUnit.MPH) return `${(kph * 0.621371).toFixed(0)} mph`;
  if (unit === WindSpeedUnit.MS)  return `${(kph / 3.6).toFixed(1)} m/s`;
  return `${kph.toFixed(0)} km/h`;
};
```

- [ ] **Step 2: Update formatHour in dateHelpers.ts**

Only `formatHour` changes — add the `format` parameter with default `H24`. All other functions stay exactly as-is.

Current signature: `export const formatHour = (datetime: string): string =>`

Replace that function only:

```ts
export const formatHour = (datetime: string, format: TimeFormat = TimeFormat.H24): string => {
  const time = datetime.split(' ')[1];
  if (format === TimeFormat.H12) {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }
  return time;
};
```

Add the import at the top of `dateHelpers.ts`:

```ts
import { TimeFormat } from '../types/units';
```

- [ ] **Step 3: Commit**

```bash
git add shared/utils/unitHelpers.ts shared/utils/dateHelpers.ts
git commit -m "feat: add formatWindSpeed helper, update formatHour to support 12h format"
```

---

## Task 4: Wire wind speed unit into WeatherInfo

**Files:**
- Modify: `features/weather/components/WeatherInfo/index.tsx`

**Context:** Current wind display: `{weatherCurrent?.wind_kph} km` (hardcoded unit). Replace with `formatWindSpeed`. The `WindJson` animation, `ThermometerJson`, `HumidityJson`, and the rest of the component are unchanged.

- [ ] **Step 1: Replace file content**

```tsx
// features/weather/components/WeatherInfo/index.tsx
import { HumidityJson, ThermometerJson, WindJson } from '@/assets/animations';
import Icon from '@/shared/components/Icon';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { getTemperatureUnitLabel, formatWindSpeed } from '@/shared/utils/unitHelpers';
import type { FC } from 'react';
import React from 'react';
import { Text, View } from 'react-native';
import type { WeatherCurrent } from '../../types/weather';
import { createStyles } from './styles';

type Props = {
  weatherCurrent?: WeatherCurrent;
};

const WeatherInfo: FC<Props> = ({ weatherCurrent }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const temperatureUnit = useSettings((state) => state.temperatureUnit);
  const windSpeedUnit = useSettings((state) => state.windSpeedUnit);
  const { textColor, subtextColor } = useWeatherThemeStore((state) => state);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Icon source={WindJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Wind now</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {formatWindSpeed(weatherCurrent?.wind_kph ?? 0, windSpeedUnit)}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={ThermometerJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Feels</Text>
        <Text style={[styles.valueText, { color: textColor }]}>
          {getTemperatureUnitLabel(weatherCurrent?.feelslike_c || 0, temperatureUnit)}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={HumidityJson} />
        <Text style={[styles.subtitle, { color: subtextColor }]}>Humidity</Text>
        <Text style={[styles.valueText, { color: textColor }]}>{weatherCurrent?.humidity}%</Text>
      </View>
    </View>
  );
};

export default WeatherInfo;
```

- [ ] **Step 2: Commit**

```bash
git add features/weather/components/WeatherInfo/index.tsx
git commit -m "feat: use formatWindSpeed in WeatherInfo respecting wind speed unit setting"
```

---

## Task 5: Wire time format into SectionTime

**Files:**
- Modify: `features/weather/components/SectionTime/index.tsx`

**Context:** Current call: `time={formatHour(item.time)}`. Add `timeFormat` from store and pass it as the second argument. Everything else unchanged.

- [ ] **Step 1: Replace file content**

```tsx
// features/weather/components/SectionTime/index.tsx
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { useWeatherThemeStore } from '@/shared/store/useWeatherThemeStore';
import { formatHour } from '@/shared/utils/dateHelpers';
import React, { type FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import { HourlyForecastCard } from '..';
import { type WeatherHour } from '../../types/weather';
import { createStyles } from './styles';

type Props = {
  data: WeatherHour[];
};

const SectionTime: FC<Props> = ({ data }) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { subtextColor } = useWeatherThemeStore((state) => state);
  const timeFormat = useSettings((state) => state.timeFormat);

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: subtextColor }]}>Next hours</Text>
      <FlatList
        data={data}
        horizontal
        scrollEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.time}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <HourlyForecastCard
            temperature={Number(item.temp_c.toFixed(0))}
            iconCode={item.condition.code}
            isDay={Boolean(item.is_day)}
            time={formatHour(item.time, timeFormat)}
          />
        )}
      />
    </View>
  );
};

export default SectionTime;
```

- [ ] **Step 2: Commit**

```bash
git add features/weather/components/SectionTime/index.tsx
git commit -m "feat: respect time format setting in SectionTime hourly forecast"
```

---

## Task 6: Update Settings screen

**Files:**
- Modify: `features/settings/screen/index.tsx`

**Context:** Remove `Location Services` block. Add Wind Speed Unit and Time Format `ItemSettings` entries using the same `SelectOption` pattern as Temperature Unit. `SelectOption` accepts `value`, `options: { value, label }[]`, and `onSelect`. `ItemSettings` accepts `title`, `icon`, and `input`.

- [ ] **Step 1: Replace file content**

```tsx
// features/settings/screen/index.tsx
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
  const { temperatureUnit, windSpeedUnit, timeFormat, setTemperatureUnit, setWindSpeedUnit, setTimeFormat } = useSettings();
  const gradient = WEATHER_GRADIENTS[WeatherCondition.DRIZZLE];

  const handleSelectTemperatureUnit = (option: Options<TemperatureUnit>) => setTemperatureUnit(option.value);
  const handleSelectWindSpeedUnit = (option: Options<WindSpeedUnit>) => setWindSpeedUnit(option.value);
  const handleSelectTimeFormat = (option: Options<TimeFormat>) => setTimeFormat(option.value);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
      />
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
  );
};

export default Settings;
```

- [ ] **Step 2: Commit**

```bash
git add features/settings/screen/index.tsx
git commit -m "feat: add wind speed and time format settings, remove location services"
```
