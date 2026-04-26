# Search API & Recent Searches — Design Spec

## Problem

The search screen (`features/search/screen/index.tsx`) uses hardcoded mock data. We need to:
1. Connect the autocomplete to the WeatherAPI search endpoint
2. Persist the last 5 searched cities with timestamps
3. Allow selecting a city to override the home screen weather (temporarily, until app restart)
4. Allow tapping a recently seen card to navigate home with that city

## API

**Endpoint:** `GET /search.json`
**Params:** `key`, `q` (city name, min 3 chars)
**Response item:**
```ts
{
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}
```

## Architecture

```
features/search/
  api/searchApi.ts             ← getForecastSearch(query): SearchLocation[]
  hooks/useSearch.ts           ← React Query, enabled: query.length >= 3, staleTime: 30s
  stores/useSearchStore.ts     ← Zustand: selectedQuery (ephemeral) + recentSearches (MMKV persist)
  types/search.ts              ← SearchLocation type (with searchedAt timestamp)
  components/Autocomplete/     ← existing, replace mock data with API
  screen/                      ← existing, connect recently seen to store

shared/utils/dateHelpers.ts    ← add formatRelativeTime(timestamp: number): string
app/index.tsx                  ← read selectedQuery, use as override over GPS query
```

## Types

```ts
// features/search/types/search.ts
export type SearchLocation = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
  searchedAt: number; // Date.now() ms timestamp, added when saving to store
};
```

## `searchApi.ts`

```ts
export const getForecastSearch = async (query: string): Promise<SearchLocation[]> => {
  const response = await api.get('/search.json', {
    params: { q: query, key: process.env.EXPO_PUBLIC_API_KEY },
  });
  return response.data;
};
```

## `useSearch.ts`

```ts
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => getForecastSearch(query),
    enabled: query.length >= 3,
    staleTime: 30_000,
  });
};
```

**Debounce:** 400ms on input value before passing to `useSearch`.

## `useSearchStore.ts`

```ts
interface SearchState {
  selectedQuery: string | null;           // ephemeral — not persisted
  recentSearches: SearchLocation[];       // persisted, max 5

  setSelectedQuery: (query: string | null) => void;
  addRecentSearch: (location: SearchLocation) => void;
  clearRecentSearches: () => void;
}
```

- Persisted via `zustandStorage` (MMKV on native, localStorage on web)
- `partialize`: persist only `recentSearches` (not `selectedQuery`)
- `addRecentSearch`: prepend new location (with `searchedAt: Date.now()`), deduplicate by `id`, keep max 5

## `Autocomplete` component

- Manages local `inputValue: string` state
- Debounces `inputValue` (400ms) → `debouncedQuery`
- Calls `useSearch(debouncedQuery)`
- On item press: `addRecentSearch({ ...location, searchedAt: Date.now() })` + `setSelectedQuery(`${lat},${lon}`)` + `router.back()`
- Shows loading indicator while `isFetching`
- Shows empty state when no results and query >= 3 chars

## `Search` screen

- Reads `recentSearches` from `useSearchStore`
- Renders `ForecastCard` per item with:
  - `title`: `location.name`
  - `subtitle`: `formatRelativeTime(location.searchedAt)`
  - `avgTemperature`: `0` (no weather data stored) — **or omit temperature display**
  - `icon`: `0` (no weather code stored)
- On card press: `setSelectedQuery(`${lat},${lon}`)` + `router.push('/')`

> **Note:** `ForecastCard` currently requires `avgTemperature` and `icon`. Since recently seen cards have no weather snapshot, these will render as 0. If this looks wrong, the card can be extended with optional `showWeather?: boolean` to hide those fields — defer to implementation.

## `app/index.tsx`

```ts
const { selectedQuery } = useSearchStore();
const { locationQuery, permissionDenied, retry } = useUserLocation();
const activeQuery = selectedQuery || locationQuery;
const { data: weatherData, isLoading } = useForecast(activeQuery);
```

## `formatRelativeTime`

Added to `shared/utils/dateHelpers.ts`:

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

## Data Flow

```
User types → debounce 400ms → useSearch(query)
  → API /search.json
  → Autocomplete shows results

User taps result:
  → addRecentSearch({ ...location, searchedAt: Date.now() })
  → setSelectedQuery("lat,lon")
  → router.back()

Home screen:
  → activeQuery = selectedQuery || locationQuery
  → useForecast(activeQuery) → shows selected city weather

App restart:
  → selectedQuery = null (ephemeral)
  → falls back to GPS

Recently seen card tapped:
  → setSelectedQuery("lat,lon")
  → router.push('/')
```

## Out of Scope

- Storing weather snapshot per recently seen city
- Clearing individual recent search entries (only bulk clear)
- Offline support / cache beyond React Query staleTime
