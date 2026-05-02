# Local Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Schedule local weather notifications (rain alert, daily summary, temperature alert) on-device when the app opens, using `expo-notifications`.

**Architecture:** On every city change, cancel all pending notifications and re-schedule across all forecast days returned by the API. A pure utility function `scheduleWeatherNotifications` receives `WeatherData` + notification settings and handles all scheduling. Permissions are requested once at boot in `_layout.tsx`.

**Tech Stack:** expo-notifications (SDK 55), Zustand persist (MMKV), React Native Switch, expo-router, TypeScript.

> **Dev build required** — expo-notifications does not work in Expo Go. Use `expo run:android` or `expo run:ios`.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `shared/store/useSettings.ts` | Modify | Add 5 notification fields + setters |
| `shared/utils/notificationHelpers.ts` | Create | `scheduleWeatherNotifications` + `NotificationSettings` type |
| `app/_layout.tsx` | Modify | Request notification permissions on mount |
| `app/index.tsx` | Modify | Call `scheduleWeatherNotifications` when city changes |
| `features/settings/screen/index.tsx` | Modify | Add Notifications section (Switch + SelectOption) |

---

## Task 1: Install expo-notifications

**Files:**
- Modify: `package.json` (via expo install)

- [ ] **Step 1: Install the package**

```bash
npx expo install expo-notifications
```

Expected output: package added to `package.json` and `yarn.lock` updated.

- [ ] **Step 2: Verify TypeScript types are available**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `expo-notifications`.

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m ":heavy_plus_sign: add expo-notifications"
```

---

## Task 2: Extend useSettings store with notification fields

**Files:**
- Modify: `shared/store/useSettings.ts`

Current file exports `useSettings` with `temperatureUnit`, `windSpeedUnit`, `timeFormat` and their setters.

- [ ] **Step 1: Replace the full file with the extended store**

Write `shared/store/useSettings.ts`:

```ts
import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '../types/units';

interface SettingsStore {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  rainAlertEnabled: boolean;
  rainAlertThreshold: number;
  dailySummaryEnabled: boolean;
  temperatureAlertEnabled: boolean;
  temperatureAlertThreshold: number;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setRainAlertEnabled: (v: boolean) => void;
  setRainAlertThreshold: (v: number) => void;
  setDailySummaryEnabled: (v: boolean) => void;
  setTemperatureAlertEnabled: (v: boolean) => void;
  setTemperatureAlertThreshold: (v: number) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: TemperatureUnit.CELSIUS,
      windSpeedUnit: WindSpeedUnit.KPH,
      timeFormat: TimeFormat.H24,
      rainAlertEnabled: false,
      rainAlertThreshold: 50,
      dailySummaryEnabled: false,
      temperatureAlertEnabled: false,
      temperatureAlertThreshold: 35,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setRainAlertEnabled: (v) => set({ rainAlertEnabled: v }),
      setRainAlertThreshold: (v) => set({ rainAlertThreshold: v }),
      setDailySummaryEnabled: (v) => set({ dailySummaryEnabled: v }),
      setTemperatureAlertEnabled: (v) => set({ temperatureAlertEnabled: v }),
      setTemperatureAlertThreshold: (v) => set({ temperatureAlertThreshold: v }),
    }),
    {
      name: 'settings',
      storage: zustandStorage,
    }
  )
);
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add shared/store/useSettings.ts
git commit -m ":sparkles: feat(settings): add notification fields to settings store"
```

---

## Task 3: Create notificationHelpers.ts

**Files:**
- Create: `shared/utils/notificationHelpers.ts`

This is a pure async function. It cancels all pending notifications, then re-schedules based on `WeatherData` and the settings slice.

- [ ] **Step 1: Create the file**

Write `shared/utils/notificationHelpers.ts`:

```ts
import type { WeatherData } from '@/features/weather/types/weather';
import { TemperatureUnit } from '@/shared/types/units';
import * as Notifications from 'expo-notifications';

export type NotificationSettings = {
  rainAlertEnabled: boolean;
  rainAlertThreshold: number;
  dailySummaryEnabled: boolean;
  temperatureAlertEnabled: boolean;
  temperatureAlertThreshold: number;
  temperatureUnit: TemperatureUnit;
};

function celsiusToFahrenheit(c: number): string {
  return `${((c * 9) / 5 + 32).toFixed(0)}°F`;
}

function formatTemp(c: number, unit: TemperatureUnit): string {
  return unit === TemperatureUnit.FAHRENHEIT
    ? celsiusToFahrenheit(c)
    : `${c.toFixed(0)}°C`;
}

export async function scheduleWeatherNotifications(
  weatherData: WeatherData,
  settings: NotificationSettings
): Promise<void> {
  const {
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    temperatureUnit,
  } = settings;

  if (!rainAlertEnabled && !dailySummaryEnabled && !temperatureAlertEnabled) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const city = weatherData.location.name;
  const now = new Date();

  for (const forecastday of weatherData.forecast.forecastday) {
    // forecastday.date is "YYYY-MM-DD" — append time to avoid UTC midnight ambiguity
    const base = new Date(`${forecastday.date}T00:00:00`);

    const trigger7am = new Date(base);
    trigger7am.setHours(7, 0, 0, 0);

    const trigger8am = new Date(base);
    trigger8am.setHours(8, 0, 0, 0);

    if (dailySummaryEnabled && trigger7am > now) {
      const maxTemp = formatTemp(forecastday.day.maxtemp_c, temperatureUnit);
      const minTemp = formatTemp(forecastday.day.mintemp_c, temperatureUnit);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: city,
          body: `${city}: ${forecastday.day.condition.text}, máx ${maxTemp}, mín ${minTemp}`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: trigger7am,
        },
      });
    }

    if (trigger8am > now) {
      if (
        rainAlertEnabled &&
        forecastday.day.daily_chance_of_rain >= rainAlertThreshold
      ) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Alerta de chuva',
            body: `Chuva prevista em ${city} hoje. Probabilidade: ${forecastday.day.daily_chance_of_rain}%`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: trigger8am,
          },
        });
      }

      if (
        temperatureAlertEnabled &&
        forecastday.day.maxtemp_c >= temperatureAlertThreshold
      ) {
        const maxTemp = formatTemp(forecastday.day.maxtemp_c, temperatureUnit);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Alerta de temperatura',
            body: `Temperatura alta em ${city} hoje: máx ${maxTemp}`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: trigger8am,
          },
        });
      }
    }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add shared/utils/notificationHelpers.ts
git commit -m ":sparkles: feat(notifications): create scheduleWeatherNotifications helper"
```

---

## Task 4: Request permissions in _layout.tsx

**Files:**
- Modify: `app/_layout.tsx`

Add a `useEffect` in `RootLayoutNav` that calls `Notifications.requestPermissionsAsync()` on mount. No blocking on result — if denied, schedule calls silently fail.

- [ ] **Step 1: Add the import and useEffect**

Current `app/_layout.tsx` has `RootLayoutNav` which already imports `useEffect`. Add:

```ts
// at the top, with other imports:
import * as Notifications from 'expo-notifications';
```

Inside `RootLayoutNav`, before the `return`, add:

```ts
useEffect(() => {
  Notifications.requestPermissionsAsync();
}, []);
```

Full updated `RootLayoutNav` function:

```tsx
function RootLayoutNav() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/_layout.tsx
git commit -m ":sparkles: feat(notifications): request notification permissions on app boot"
```

---

## Task 5: Wire scheduling in app/index.tsx

**Files:**
- Modify: `app/index.tsx`

Add a `useEffect` that fires when `weatherData?.location.name` changes (i.e., when city changes). It reads notification settings from `useSettings` and calls `scheduleWeatherNotifications`.

- [ ] **Step 1: Add imports**

At the top of `app/index.tsx`, add:

```ts
import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import { useSettings } from '@/shared/store/useSettings';
```

- [ ] **Step 2: Add selector calls inside TabOneScreen**

After the existing `const theme = useAppTheme();` line, add:

```ts
const rainAlertEnabled = useSettings((s) => s.rainAlertEnabled);
const rainAlertThreshold = useSettings((s) => s.rainAlertThreshold);
const dailySummaryEnabled = useSettings((s) => s.dailySummaryEnabled);
const temperatureAlertEnabled = useSettings((s) => s.temperatureAlertEnabled);
const temperatureAlertThreshold = useSettings((s) => s.temperatureAlertThreshold);
const temperatureUnit = useSettings((s) => s.temperatureUnit);
```

- [ ] **Step 3: Add the scheduling useEffect**

After the selector calls, add:

```ts
useEffect(() => {
  if (!weatherData) return;
  scheduleWeatherNotifications(weatherData, {
    rainAlertEnabled,
    rainAlertThreshold,
    dailySummaryEnabled,
    temperatureAlertEnabled,
    temperatureAlertThreshold,
    temperatureUnit,
  });
}, [weatherData?.location.name]);
```

Full updated `TabOneScreen` function (complete file for reference):

```tsx
import { useSearchStore } from '@/features/search/stores/useSearchStore';
import {
  LocationPermissionDenied,
  SectionDays,
  SectionTime,
  WeatherError,
  WeatherInfo,
} from '@/features/weather/components';
import Header from '@/features/weather/components/Header';
import { useForecast } from '@/features/weather/hooks/useForecast';
import { useUserLocation } from '@/features/weather/hooks/useUserLocation';
import { WEATHER_GRADIENTS } from '@/shared/constants/WeatherGradients';
import { useAppTheme } from '@/shared/hooks/useAppTheme';
import { useSettings } from '@/shared/store/useSettings';
import { getNextHours } from '@/shared/utils/dateHelpers';
import { mapCodeToCondition } from '@/shared/utils/iconHelpers';
import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { createStyles } from './styles';

export default function TabOneScreen() {
  const { locationQuery, permissionDenied, retry } = useUserLocation();
  const { selectedQuery } = useSearchStore();
  const activeQuery = selectedQuery ?? locationQuery;
  const { data: weatherData, isLoading, isError, refetch } = useForecast(activeQuery);
  const weatherCondition = mapCodeToCondition(
    weatherData?.current?.condition.code || 0,
    !!weatherData?.current.is_day
  );
  const gradient = WEATHER_GRADIENTS[weatherCondition];
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const rainAlertEnabled = useSettings((s) => s.rainAlertEnabled);
  const rainAlertThreshold = useSettings((s) => s.rainAlertThreshold);
  const dailySummaryEnabled = useSettings((s) => s.dailySummaryEnabled);
  const temperatureAlertEnabled = useSettings((s) => s.temperatureAlertEnabled);
  const temperatureAlertThreshold = useSettings((s) => s.temperatureAlertThreshold);
  const temperatureUnit = useSettings((s) => s.temperatureUnit);

  useEffect(() => {
    if (!weatherData) return;
    scheduleWeatherNotifications(weatherData, {
      rainAlertEnabled,
      rainAlertThreshold,
      dailySummaryEnabled,
      temperatureAlertEnabled,
      temperatureAlertThreshold,
      temperatureUnit,
    });
  }, [weatherData?.location.name]);

  if (permissionDenied) return <LocationPermissionDenied onRetry={retry} />;

  if (!activeQuery) {
    return (
      <View style={styles.gpsLoadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError && !weatherData) return <WeatherError onRetry={refetch} />;

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

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/index.tsx
git commit -m ":sparkles: feat(notifications): schedule notifications when city changes"
```

---

## Task 6: Add Notifications section to Settings screen

**Files:**
- Modify: `features/settings/screen/index.tsx`

Add Rain Alert (Switch + conditional threshold SelectOption), Daily Summary (Switch), and Temperature Alert (Switch + conditional threshold SelectOption) rows below existing settings.

Also update existing zIndex wrappers from 3/2/1 to 8/7/6 so that all SelectOption dropdowns correctly render above items below them.

- [ ] **Step 1: Write the updated settings screen**

Write `features/settings/screen/index.tsx`:

```tsx
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
  const handleSelectTimeFormat = (option: Options<TimeFormat>) =>
    setTimeFormat(option.value);
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
          input={
            <Switch value={rainAlertEnabled} onValueChange={setRainAlertEnabled} />
          }
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
          input={
            <Switch value={dailySummaryEnabled} onValueChange={setDailySummaryEnabled} />
          }
        />
      </View>
      <View style={{ zIndex: 2 }}>
        <ItemSettings
          title="Alerta de temperatura"
          icon={<MaterialCommunityIcons name="thermometer" size={24} color="black" />}
          input={
            <Switch
              value={temperatureAlertEnabled}
              onValueChange={setTemperatureAlertEnabled}
            />
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
```

- [ ] **Step 2: Add `sectionTitle` style to settings screen styles**

In `features/settings/screen/styles.ts`, add `sectionTitle` to the returned object:

```ts
import type { AppTheme } from '@/shared/constants/theme';

export const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  itemContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  itemText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: '600' as const,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    textTransform: 'uppercase' as const,
  },
});
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add features/settings/screen/index.tsx features/settings/screen/styles.ts
git commit -m ":sparkles: feat(settings): add Notificações section with alert toggles and thresholds"
```

---

## Manual Verification Checklist

After running `expo run:ios` or `expo run:android` (dev build required):

- [ ] App requests notification permission on first launch
- [ ] Settings screen shows "Notificações" section below Time Format
- [ ] Rain Alert toggle shows/hides threshold selector
- [ ] Temperature Alert toggle shows/hides threshold selector
- [ ] Changing city on home screen re-schedules notifications (check via OS notification center or `Notifications.getAllScheduledNotificationsAsync()` in Reactotron/console)
- [ ] All enabled alerts disabled → no notifications scheduled (early return)
- [ ] Rain chance below threshold → no rain alert scheduled for that day
- [ ] Temperature below threshold → no temp alert scheduled for that day
- [ ] Past-time triggers skipped (e.g., today's 7am if it's already 9am)
- [ ] Temperature threshold labels update when temperature unit changes (°C ↔ °F)
