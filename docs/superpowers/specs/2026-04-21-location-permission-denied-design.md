# Location Permission Denied — Design Spec

## Problem

When the user denies location permission, the main screen has no data to display. Currently the app silently falls back to `auto:ip`. The correct behavior is to show a dedicated screen explaining the situation with actionable options.

## Approach

Conditional render in `index.tsx` based on `permissionDenied` flag returned from `useUserLocation`. No new routes needed.

## Components

### `useUserLocation` (modified)

**File:** `features/weather/hooks/useUserLocation.ts`

Add two new return values:
- `permissionDenied: boolean` — true when `requestForegroundPermissionsAsync` returns status !== 'granted'
- `retry: () => void` — calls `Linking.openSettings()` to open app settings so user can re-enable location manually

### `LocationPermissionDenied` (new)

**File:** `features/weather/components/LocationPermissionDenied/index.tsx`

Full-screen component rendered when `permissionDenied === true`.

Layout (centered, vertical):
- `Ionicons` icon `location-off` (size ~80, muted color)
- Title: "Location access denied"
- Subtitle: "Enable location in settings or search for a city manually."
- Button "Open Settings" → calls `onRetry` prop
- Button "Search by city" → `router.push('/search')`

Styling follows project pattern: `createStyles(theme)` + `LinearGradient` background using a neutral gradient (e.g. `WEATHER_GRADIENTS[WeatherCondition.CLOUDY]`).

Props:
```ts
type Props = {
  onRetry: () => void;
};
```

### `index.tsx` (modified)

**File:** `app/index.tsx`

```ts
const { locationQuery, permissionDenied, retry } = useUserLocation();

if (permissionDenied) return <LocationPermissionDenied onRetry={retry} />;
```

## Data Flow

```
useUserLocation
  → status !== 'granted' → permissionDenied: true
  → index.tsx renders LocationPermissionDenied
      → "Open Settings" → Linking.openSettings()
      → "Search by city" → router.push('/search')
```

## Out of Scope

- Automatic retry after returning from settings (requires app state listener)
- Persisting the user's choice
