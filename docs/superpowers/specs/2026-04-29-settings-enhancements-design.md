# Settings Enhancements Design

## Goal

Add wind speed unit and time format settings to the app, with full persistence via MMKV. Remove the unused Location Services toggle.

## Scope

Three surfaces change: the settings store, two utility helpers, two weather components, and the settings screen.

---

## Architecture

Approach B — utility helpers + store. Each component reads the relevant setting directly from `useSettings` via a narrowed selector and passes it to a helper function. No new abstractions, no wrapper hooks. Follows the existing pattern used by `getTemperatureUnitLabel` in `WeatherInfo` and `Header`.

---

## Types — `shared/types/units.ts`

Add two enums:

```ts
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

---

## Store — `shared/store/useSettings.ts`

**Changes:**
- Uncomment and enable `persist` with `zustandStorage` (MMKV on native, web storage on web)
- Add `windSpeedUnit: WindSpeedUnit` (default: `KPH`)
- Add `timeFormat: TimeFormat` (default: `H24`)
- Add `setWindSpeedUnit(unit: WindSpeedUnit): void`
- Add `setTimeFormat(format: TimeFormat): void`
- Remove `locationServicesEnabled`, `setLocationServicesEnabled` (unused)
- Remove `theme`, `toggleTheme`, `setTheme` (theme already handled by `useThemeStore`)
- Remove `hasHydrated` / `setHasHydrated` (no longer needed — persist handles rehydration)

Persisted fields: `temperatureUnit`, `windSpeedUnit`, `timeFormat`.

---

## Utility Helpers

### `shared/utils/unitHelpers.ts`

Add:

```ts
export const formatWindSpeed = (kph: number, unit: WindSpeedUnit): string => {
  if (unit === WindSpeedUnit.MPH) return `${(kph * 0.621371).toFixed(0)} mph`;
  if (unit === WindSpeedUnit.MS)  return `${(kph / 3.6).toFixed(1)} m/s`;
  return `${kph.toFixed(0)} km/h`;
};
```

### `shared/utils/dateHelpers.ts`

Update `formatHour` to accept an optional `TimeFormat` parameter:

```ts
export const formatHour = (datetime: string, format: TimeFormat = TimeFormat.H24): string => {
  const time = datetime.split(' ')[1]; // "14:00"
  if (format === TimeFormat.H12) {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }
  return time;
};
```

Default `H24` keeps all existing callers unchanged — no breaking change.

---

## Component Changes

### `features/weather/components/WeatherInfo/index.tsx`

Current: `{weatherCurrent?.wind_kph} km` (hardcoded unit)

Change:
- Add `windSpeedUnit` from `useSettings((state) => state.windSpeedUnit)`
- Replace wind display with `{formatWindSpeed(weatherCurrent?.wind_kph ?? 0, windSpeedUnit)}`

### `features/weather/components/SectionTime/index.tsx`

Current: `time={formatHour(item.time)}` (always 24h)

Change:
- Add `timeFormat` from `useSettings((state) => state.timeFormat)`
- Replace with `time={formatHour(item.time, timeFormat)}`

### `features/weather/components/Header/index.tsx`

No change — Header shows date only (`localtime.split(' ')[0]`), not time.

---

## Settings Screen — `features/settings/screen/index.tsx`

**Remove:** `Location Services` `ItemSettings` block and all references to `locationServicesEnabled`.

**Add:** Two new `ItemSettings` entries using `SelectOption`, same pattern as Temperature Unit:

**Wind Speed Unit**
- Options: `{ value: WindSpeedUnit.KPH, label: 'km/h' }`, `{ value: WindSpeedUnit.MPH, label: 'mph' }`, `{ value: WindSpeedUnit.MS, label: 'm/s' }`
- Icon: `MaterialCommunityIcons name="weather-windy"`

**Time Format**
- Options: `{ value: TimeFormat.H24, label: '24 hours' }`, `{ value: TimeFormat.H12, label: '12 hours (AM/PM)' }`
- Icon: `MaterialCommunityIcons name="clock-outline"`

Final screen has 3 `ItemSettings`: Temperature Unit, Wind Speed Unit, Time Format.

---

## File Map

| File | Action |
|------|--------|
| `shared/types/units.ts` | Modify — add `WindSpeedUnit`, `TimeFormat` enums |
| `shared/store/useSettings.ts` | Modify — enable persist, add new fields, remove unused |
| `shared/utils/unitHelpers.ts` | Modify — add `formatWindSpeed` |
| `shared/utils/dateHelpers.ts` | Modify — update `formatHour` signature |
| `features/weather/components/WeatherInfo/index.tsx` | Modify — use `formatWindSpeed` |
| `features/weather/components/SectionTime/index.tsx` | Modify — pass `timeFormat` to `formatHour` |
| `features/settings/screen/index.tsx` | Modify — add 2 settings, remove Location Services |
