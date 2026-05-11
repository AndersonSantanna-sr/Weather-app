<div align="center">
  <img src="assets/images/icon.png" width="120" alt="Weather App Icon" />

  <h1>Weather App</h1>

  <p>React Native weather app built with Expo — real-time forecasts, push notifications, and animated splash screen.</p>

  <p>
    <img src="https://img.shields.io/badge/expo-SDK%2055-000020?logo=expo" alt="Expo SDK 55" />
    <img src="https://img.shields.io/badge/react--native-0.83-61DAFB?logo=react" alt="React Native 0.83" />
    <img src="https://img.shields.io/badge/typescript-5.9-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/github/actions/workflow/status/AndersonSantanna-sr/Weather-app/ci.yml?label=CI&logo=githubactions&logoColor=white" alt="CI Status" />
    <img src="https://img.shields.io/github/v/release/AndersonSantanna-sr/Weather-app?label=latest%20APK&logo=android" alt="Latest Release" />
  </p>
</div>

---

## Features

- Current weather + hourly and daily forecast
- Location-based weather via GPS
- City search
- Push notifications: rain alerts, temperature alerts, daily summary
- Customizable units (°C/°F, km/h / mph / m/s, 12h/24h)
- Animated SVG splash screen
- Offline-ready with persistent settings (MMKV)

## Architecture

Feature-sliced structure — each feature owns its API, hooks, components, and stores. Shared utilities live outside features.

```
weather-app/
├── app/                    # Expo Router screens + layout
│   └── components/         # AnimatedSplash
├── features/
│   ├── weather/            # Forecast API, hooks, UI components
│   ├── search/             # City search API, hooks, UI
│   └── settings/           # Settings screen
├── shared/
│   ├── components/         # Reusable UI (ForecastCard, Skeleton, Toast…)
│   ├── store/              # useSettings Zustand store
│   ├── utils/              # unitHelpers, notificationHelpers
│   └── types/              # Shared TypeScript types
├── lib/
│   ├── api/                # Axios instance
│   └── storage/            # MMKV + Zustand persist adapter
├── config/
│   ├── query/              # React Query client
│   └── reactotron/         # Debug config
└── scripts/
    └── generate-assets.mjs # SVG → PNG icon/splash generation
```

## Tech Stack

### Runtime

| Library | Purpose |
|---|---|
| [Expo SDK 55](https://expo.dev) | Build toolchain, native modules |
| [React Native 0.83](https://reactnative.dev) | Core framework |
| [expo-router](https://expo.github.io/router) | File-based navigation |
| [React Query v5](https://tanstack.com/query) | Server state, caching |
| [Zustand v5](https://zustand-demo.pmnd.rs) | Client state management |
| [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) | Persistent key-value storage |
| [Axios](https://axios-http.com) | HTTP client |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Animated SVG splash |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Push / local notifications |
| [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) | GPS location |
| [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native) | Lottie animations |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Performant animations |

### Development

| Tool | Purpose |
|---|---|
| TypeScript 5.9 | Static typing |
| ESLint + Prettier | Lint and formatting |
| [Husky v9](https://typicode.github.io/husky) | Git hooks |
| [lint-staged](https://github.com/lint-staged/lint-staged) | Run linters on staged files |
| Jest + jest-expo | Unit testing |
| [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/) | Component/hook testing |
| [@resvg/resvg-js](https://github.com/yisibl/resvg-js) | SVG → PNG asset generation |
| [Reactotron](https://github.com/infinitered/reactotron) | Debug inspector |
| [EAS Build](https://docs.expo.dev/build/introduction/) | Cloud Android/iOS builds |

## CI / CD

### CI — Pull Request to `main`

Four parallel jobs run on every PR:

| Job | What it checks |
|---|---|
| **TypeScript** | `tsc --noEmit` — zero type errors |
| **ESLint** | Lint rules + Prettier format |
| **Jest** | 22 unit tests with coverage |
| **Version Bumped** | `package.json` version must be higher than `main` |

### CD — Merge to `main`

1. EAS Build compiles release APK in the cloud (`eas build --profile release`)
2. Built APK downloaded via `eas build:list --json`
3. GitHub Release `latest` created/updated with APK attached

> Download the latest APK from the [Releases page](../../releases/latest) and install on any Android device (enable *Install from unknown sources*).

## Quality Gates

**Pre-commit** (Husky + lint-staged):
- Full TypeScript check (`tsc --noEmit`)
- ESLint fix + Prettier format on staged `.ts`/`.tsx` files

**Pre-push** (Husky):
- Full test suite (`jest --ci --coverage`)

## Getting Started

### Prerequisites

- Node 20+
- Yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio or physical Android device

### Install

```bash
yarn install
```

### Environment

Create `.env` at the project root:

```env
EXPO_PUBLIC_WEATHER_API_KEY=your_weatherapi_key
EXPO_PUBLIC_WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
```

Get a free API key at [weatherapi.com](https://www.weatherapi.com).

### Run

```bash
# Start dev server
yarn start

# Android
yarn android

# iOS
yarn ios
```

### Generate App Icons

Regenerate all icon/splash PNGs from the SVG source:

```bash
node scripts/generate-assets.mjs
```

## Scripts

| Script | Description |
|---|---|
| `yarn start` | Start Expo dev server |
| `yarn android` | Run on Android |
| `yarn ios` | Run on iOS |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Auto-fix lint errors |
| `yarn format` | Prettier format all files |
| `yarn test` | Run all tests |
| `yarn test:coverage` | Tests with coverage report |
| `yarn test:ci` | Tests in CI mode |

## Tests

```
Test Suites: 4 passed
Tests:       22 passed

Coverage:
  shared/utils/unitHelpers.ts         100%
  shared/utils/notificationHelpers.ts  96%
  shared/store/useSettings.ts          70%
  features/weather/hooks/useForecast   100%
```

Test files live alongside their source under `__tests__/` directories.
