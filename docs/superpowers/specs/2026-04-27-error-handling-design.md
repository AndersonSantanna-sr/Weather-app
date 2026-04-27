# Error Handling Design

## Goal

Ensure users always see meaningful feedback when any API call fails — no blank screens, no silent failures.

## Scope

Three surfaces, each with its own error pattern:

1. **Home screen** — forecast API fails
2. **Search autocomplete** — city search API fails
3. **Recent search cards** — individual forecast fetch fails

---

## Architecture

Use React Query's `isError` and `refetch` directly in each component. No wrapper hooks or error boundaries — React Query already exposes everything needed.

---

## Surface 1 — Home Screen: WeatherError Component

**Trigger:** `isError === true` from `useForecast(activeQuery)` in `app/index.tsx`.

**Component:** `features/weather/components/WeatherError/index.tsx` + `styles.ts`

**Render order in `app/index.tsx`:**
```
if (permissionDenied) → LocationPermissionDenied
if (!activeQuery)     → GPS loading spinner
if (isError)          → WeatherError          ← new
return                → normal weather screen
```

**WeatherError design:**
- Full-screen `LinearGradient` using `WEATHER_GRADIENTS[WeatherCondition.CLOUDY]` (same as `LocationPermissionDenied`)
- Ionicons `cloud-offline-outline`, size 80, color white
- Title: `"Algo deu errado"`
- Subtitle: `"Não foi possível carregar a previsão. Verifique sua conexão e tente novamente."`
- Primary button: `"Tentar novamente"` → calls `onRetry`
- Secondary button: `"Buscar cidade"` → `router.push('/search')`

**Props:**
```ts
type Props = { onRetry: () => void };
```

**Export:** added to `features/weather/components/index.ts`.

---

## Surface 2 — Search Autocomplete: Toast

**Trigger:** `isError === true` from `useSearch(debouncedQuery)` in `Autocomplete`.

**Component:** `shared/components/Toast/index.tsx`

**Behaviour:**
- Appears at the top of the screen (absolute position, below status bar)
- Red semi-transparent background (`rgba(229, 57, 53, 0.9)`)
- White text message
- Auto-dismisses after 3 000 ms via `Animated.timing` on opacity
- `onHide` called after animation completes so parent can reset `visible`

**Props:**
```ts
type Props = {
  message: string;
  visible: boolean;
  onHide: () => void;
};
```

**Integration in Autocomplete:**
- `useState<boolean>(false)` for `toastVisible`
- `useEffect` watching `isError`: when `true`, set `toastVisible = true`
- Render `<Toast message="Erro ao buscar cidades. Tente novamente." visible={toastVisible} onHide={() => setToastVisible(false)} />`

---

## Surface 3 — RecentSearchCard: Inline Error with Retry

**Trigger:** `isError === true` from `useForecast` inside `RecentSearchCard`.

**No new component** — branch added inside existing `RecentSearchCard`.

**Render logic:**
```
isFetching && !data  → ActivityIndicator
isError              → error state         ← new
default              → ForecastCard
```

**Error state renders a `ForecastCard` with:**
- `avgTemperature={0}` and `icon={0}` (will show `0°C` and unknown icon) — **no**, instead pass sentinel values and extend `ForecastCard` to accept optional `errorState` prop that overrides display to `"—"` and shows `warning-outline` icon.

**Correction — simpler approach (no ForecastCard changes):**
Render a custom `View` matching `ForecastCard`'s visual style with:
- City name (from `item.name`)
- Timestamp (from `formatRelativeTime(item.searchedAt)`)
- Temperature text: `"—"`
- Ionicons `warning-outline` in place of weather icon
- Small `TouchableOpacity` with `refresh-outline` icon → calls `refetch()`

This keeps `ForecastCard` unchanged and avoids adding error-specific props to a shared component.

---

## Files Created

| File | Purpose |
|------|---------|
| `features/weather/components/WeatherError/index.tsx` | Full-screen error for home |
| `features/weather/components/WeatherError/styles.ts` | Styles using theme tokens |
| `shared/components/Toast/index.tsx` | Auto-dismiss toast |

## Files Modified

| File | Change |
|------|--------|
| `app/index.tsx` | Add `isError` guard → render `WeatherError` |
| `features/weather/components/index.ts` | Export `WeatherError` |
| `features/search/components/Autocomplete/index.tsx` | Consume `isError`, show Toast |
| `features/search/components/RecentSearchCard/index.tsx` | Add `isError` branch with inline error + retry |
