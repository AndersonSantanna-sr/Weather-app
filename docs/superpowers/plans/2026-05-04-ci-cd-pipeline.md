# CI/CD Pipeline & Unit Tests — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unit tests, local Husky quality gate, GitHub Actions CI on PR, and automated Android APK release on merge to main via EAS Build.

**Architecture:** Jest + jest-expo for unit tests; Husky + lint-staged for local hooks; GitHub Actions for remote CI (lint + tsc + test + version-check) and CD (EAS Build → GitHub Release `latest`). EAS manages Android keystore and injects secrets at build time.

**Tech Stack:** Jest, jest-expo, @testing-library/react-native, Husky, lint-staged, GitHub Actions, EAS CLI, gh CLI

---

## File Structure

```
jest.config.js                                         ← new: Jest config with jest-expo preset
shared/utils/__tests__/unitHelpers.test.ts             ← new: unit tests for temperature/wind helpers
shared/utils/__tests__/notificationHelpers.test.ts     ← new: unit tests for notification scheduling logic
shared/store/__tests__/useSettings.test.ts             ← new: unit tests for Zustand settings store
features/weather/hooks/__tests__/useForecast.test.ts   ← new: unit tests for React Query forecast hook
.husky/pre-commit                                      ← new: tsc + lint-staged
.husky/pre-push                                        ← new: jest
eas.json                                               ← modify: add `release` profile (buildType: apk)
package.json                                           ← modify: add test/prepare scripts + lint-staged config
.github/workflows/ci.yml                               ← new: PR quality gate (typecheck, lint, test, version-check)
.github/workflows/release.yml                          ← new: CD on merge to main (EAS build + GitHub Release)
```

---

## Task 1: EAS Release Profile

**Files:**
- Modify: `eas.json`

- [ ] **Step 1: Add `release` profile to eas.json**

The existing `eas.json` has `development`, `preview`, `production`. Add `release` for portfolio APK:

```json
{
  "cli": {
    "version": ">= 18.9.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    },
    "release": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

- [ ] **Step 2: Register EXPO_PUBLIC_API_KEY as EAS secret**

Run locally (requires `eas-cli` installed and `eas login` done):

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_KEY --value <your_weatherapi_key>
```

To verify it was saved:
```bash
eas secret:list
```

Expected output includes `EXPO_PUBLIC_API_KEY` with scope `project`.

- [ ] **Step 3: Create EXPO_TOKEN for GitHub Actions**

1. Go to https://expo.dev/accounts/<your-username>/settings/access-tokens
2. Click **Create Token** → name it `github-actions` → copy the value
3. Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
4. Name: `EXPO_TOKEN`, Value: paste the token

- [ ] **Step 4: Commit eas.json**

```bash
git add eas.json
git commit -m "chore: add release APK build profile to eas.json"
```

---

## Task 2: Configure Jest

**Files:**
- Create: `jest.config.js`
- Modify: `package.json`

- [ ] **Step 1: Install Jest dependencies**

```bash
yarn add -D jest-expo @testing-library/react-native @testing-library/jest-native
```

- [ ] **Step 2: Create jest.config.js**

```js
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverageFrom: [
    'shared/utils/**/*.ts',
    'shared/store/**/*.ts',
    'features/weather/hooks/**/*.ts',
    '!**/__tests__/**',
    '!**/*.d.ts',
  ],
};
```

- [ ] **Step 3: Add test script to package.json**

In the `"scripts"` section of `package.json`, add:

```json
"test": "jest",
"test:coverage": "jest --coverage",
"test:ci": "jest --ci --coverage --passWithNoTests"
```

- [ ] **Step 4: Run jest to confirm setup works**

```bash
yarn test --passWithNoTests
```

Expected: `Test Suites: 0 skipped, 0 total` with exit code 0.

- [ ] **Step 5: Commit**

```bash
git add jest.config.js package.json yarn.lock
git commit -m "chore: configure Jest with jest-expo preset"
```

---

## Task 3: Unit Tests — unitHelpers

**Files:**
- Create: `shared/utils/__tests__/unitHelpers.test.ts`

`getTemperatureUnitLabel(temp, unit)` converts °C to label. `formatWindSpeed(kph, unit)` converts speed.

- [ ] **Step 1: Create test file**

```ts
import { TemperatureUnit, WindSpeedUnit } from '@/shared/types/units';
import {
  formatWindSpeed,
  getTemperatureUnitLabel,
} from '@/shared/utils/unitHelpers';

describe('getTemperatureUnitLabel', () => {
  it('returns celsius label unchanged', () => {
    expect(getTemperatureUnitLabel(25, TemperatureUnit.CELSIUS)).toBe('25°C');
  });

  it('converts celsius to fahrenheit', () => {
    expect(getTemperatureUnitLabel(0, TemperatureUnit.FAHRENHEIT)).toBe('32°F');
  });

  it('rounds to 0 decimal places', () => {
    expect(getTemperatureUnitLabel(22.6, TemperatureUnit.CELSIUS)).toBe('23°C');
  });

  it('converts negative celsius correctly', () => {
    expect(getTemperatureUnitLabel(-10, TemperatureUnit.FAHRENHEIT)).toBe('14°F');
  });
});

describe('formatWindSpeed', () => {
  it('returns km/h by default (KPH unit)', () => {
    expect(formatWindSpeed(100, WindSpeedUnit.KPH)).toBe('100 km/h');
  });

  it('converts to mph', () => {
    expect(formatWindSpeed(100, WindSpeedUnit.MPH)).toBe('62 mph');
  });

  it('converts to m/s with 1 decimal', () => {
    expect(formatWindSpeed(36, WindSpeedUnit.MS)).toBe('10.0 m/s');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (file doesn't exist yet)**

```bash
yarn test shared/utils/__tests__/unitHelpers.test.ts
```

Expected: FAIL — `Cannot find module '@/shared/utils/unitHelpers'`

- [ ] **Step 3: Run tests again — they should PASS now (source already exists)**

The source file `shared/utils/unitHelpers.ts` already exists. Run again:

```bash
yarn test shared/utils/__tests__/unitHelpers.test.ts --verbose
```

Expected: all 7 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add shared/utils/__tests__/unitHelpers.test.ts
git commit -m "test: add unit tests for unitHelpers (temperature/wind conversion)"
```

---

## Task 4: Unit Tests — notificationHelpers

**Files:**
- Create: `shared/utils/__tests__/notificationHelpers.test.ts`

`scheduleWeatherNotifications` uses lazy `require('expo-notifications')` — jest.mock intercepts it.

- [ ] **Step 1: Create test file**

```ts
import { scheduleWeatherNotifications } from '@/shared/utils/notificationHelpers';
import { TemperatureUnit } from '@/shared/types/units';

const mockSchedule = jest.fn().mockResolvedValue(undefined);
const mockCancel = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-notifications', () => ({
  cancelAllScheduledNotificationsAsync: () => mockCancel(),
  scheduleNotificationAsync: (...args: unknown[]) => mockSchedule(...args),
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

const baseSettings = {
  rainAlertEnabled: false,
  rainAlertThreshold: 50,
  dailySummaryEnabled: false,
  temperatureAlertEnabled: false,
  temperatureAlertThreshold: 35,
  temperatureUnit: TemperatureUnit.CELSIUS,
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const makeWeatherData = (overrides: Record<string, unknown> = {}) => ({
  location: { name: 'São Paulo' },
  forecast: {
    forecastday: [
      {
        date: tomorrowStr,
        day: {
          maxtemp_c: 38,
          mintemp_c: 22,
          daily_chance_of_rain: 75,
          condition: { text: 'Sunny' },
          ...overrides,
        },
      },
    ],
  },
});

beforeEach(() => {
  mockSchedule.mockClear();
  mockCancel.mockClear();
});

describe('scheduleWeatherNotifications', () => {
  it('cancels all notifications even when all alerts disabled', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, baseSettings);
    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('schedules daily summary when enabled', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      dailySummaryEnabled: true,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('São Paulo');
  });

  it('schedules rain alert when chance >= threshold', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      rainAlertEnabled: true,
      rainAlertThreshold: 50,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('Alerta de chuva');
  });

  it('does not schedule rain alert when chance < threshold', async () => {
    await scheduleWeatherNotifications(
      makeWeatherData({ daily_chance_of_rain: 30 }) as never,
      { ...baseSettings, rainAlertEnabled: true, rainAlertThreshold: 50 }
    );
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('schedules temperature alert when maxtemp_c >= threshold', async () => {
    await scheduleWeatherNotifications(makeWeatherData() as never, {
      ...baseSettings,
      temperatureAlertEnabled: true,
      temperatureAlertThreshold: 35,
    });
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule.mock.calls[0][0].content.title).toBe('Alerta de temperatura');
  });

  it('does not schedule temperature alert when maxtemp_c < threshold', async () => {
    await scheduleWeatherNotifications(
      makeWeatherData({ maxtemp_c: 30 }) as never,
      { ...baseSettings, temperatureAlertEnabled: true, temperatureAlertThreshold: 35 }
    );
    expect(mockSchedule).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests**

```bash
yarn test shared/utils/__tests__/notificationHelpers.test.ts --verbose
```

Expected: all 6 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add shared/utils/__tests__/notificationHelpers.test.ts
git commit -m "test: add unit tests for notificationHelpers scheduling logic"
```

---

## Task 5: Unit Tests — useSettings Store

**Files:**
- Create: `shared/store/__tests__/useSettings.test.ts`

MMKV is a native module — mock `@/lib/storage/storage` with in-memory storage.

- [ ] **Step 1: Create test file**

```ts
import { act, renderHook } from '@testing-library/react-native';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '@/shared/types/units';

jest.mock('@/lib/storage/storage', () => {
  const store: Record<string, string> = {};
  return {
    zustandStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
    },
  };
});

// Import AFTER mock is set up
import { useSettings } from '@/shared/store/useSettings';

beforeEach(() => {
  useSettings.setState({
    temperatureUnit: TemperatureUnit.CELSIUS,
    windSpeedUnit: WindSpeedUnit.KPH,
    timeFormat: TimeFormat.H24,
    rainAlertEnabled: false,
    rainAlertThreshold: 50,
    dailySummaryEnabled: false,
    temperatureAlertEnabled: false,
    temperatureAlertThreshold: 35,
  });
});

describe('useSettings defaults', () => {
  it('has correct default values', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.temperatureUnit).toBe(TemperatureUnit.CELSIUS);
    expect(result.current.windSpeedUnit).toBe(WindSpeedUnit.KPH);
    expect(result.current.rainAlertEnabled).toBe(false);
    expect(result.current.rainAlertThreshold).toBe(50);
    expect(result.current.temperatureAlertThreshold).toBe(35);
  });
});

describe('useSettings setters', () => {
  it('setTemperatureUnit updates unit', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setTemperatureUnit(TemperatureUnit.FAHRENHEIT));
    expect(result.current.temperatureUnit).toBe(TemperatureUnit.FAHRENHEIT);
  });

  it('setRainAlertEnabled toggles value', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setRainAlertEnabled(true));
    expect(result.current.rainAlertEnabled).toBe(true);
  });

  it('setRainAlertThreshold updates threshold', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setRainAlertThreshold(70));
    expect(result.current.rainAlertThreshold).toBe(70);
  });

  it('setTemperatureAlertThreshold updates threshold', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setTemperatureAlertThreshold(40));
    expect(result.current.temperatureAlertThreshold).toBe(40);
  });

  it('setDailySummaryEnabled toggles value', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setDailySummaryEnabled(true));
    expect(result.current.dailySummaryEnabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
yarn test shared/store/__tests__/useSettings.test.ts --verbose
```

Expected: all 6 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add shared/store/__tests__/useSettings.test.ts
git commit -m "test: add unit tests for useSettings Zustand store"
```

---

## Task 6: Unit Tests — useForecast Hook

**Files:**
- Create: `features/weather/hooks/__tests__/useForecast.test.ts`

Mock `weatherApi.ts` so no real HTTP calls are made. Wrap with `QueryClientProvider`.

- [ ] **Step 1: Create test file**

```ts
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForecast } from '@/features/weather/hooks/useForecast';

const mockGetForecast = jest.fn();

jest.mock('@/features/weather/api/weatherApi', () => ({
  getForecast: (...args: unknown[]) => mockGetForecast(...args),
}));

const mockWeatherData = {
  location: { name: 'São Paulo' },
  forecast: { forecastday: [] },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  mockGetForecast.mockClear();
});

describe('useForecast', () => {
  it('is disabled when query is empty string', () => {
    const { result } = renderHook(() => useForecast(''), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetForecast).not.toHaveBeenCalled();
  });

  it('fetches data when query is provided', async () => {
    mockGetForecast.mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useForecast('São Paulo'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWeatherData);
    expect(mockGetForecast).toHaveBeenCalledWith('São Paulo');
  });

  it('returns error state when API fails', async () => {
    mockGetForecast.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useForecast('São Paulo'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
yarn test features/weather/hooks/__tests__/useForecast.test.ts --verbose
```

Expected: all 3 tests PASS.

- [ ] **Step 3: Run full test suite**

```bash
yarn test --verbose
```

Expected: all 22 tests PASS across 4 suites.

- [ ] **Step 4: Commit**

```bash
git add features/weather/hooks/__tests__/useForecast.test.ts
git commit -m "test: add unit tests for useForecast React Query hook"
```

---

## Task 7: Husky + lint-staged

**Files:**
- Modify: `package.json`
- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`

- [ ] **Step 1: Install Husky and lint-staged**

```bash
yarn add -D husky lint-staged
```

- [ ] **Step 2: Add prepare script and lint-staged config to package.json**

In `package.json`, add to `"scripts"`:
```json
"prepare": "husky"
```

At the root level of `package.json` (alongside `"scripts"`), add:
```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

- [ ] **Step 3: Initialize Husky**

```bash
yarn prepare
```

Expected: `.husky/` directory created.

- [ ] **Step 4: Create pre-commit hook**

```bash
cat > .husky/pre-commit << 'EOF'
npx tsc --noEmit
npx lint-staged
EOF
```

- [ ] **Step 5: Create pre-push hook**

```bash
cat > .husky/pre-push << 'EOF'
yarn test:ci
EOF
```

- [ ] **Step 6: Test the hooks work**

Make a small change to a `.ts` file, stage it, and run:

```bash
git add .
git commit -m "test: verify husky hooks" --dry-run
```

Expected: tsc runs, lint-staged runs on staged files. No errors.

- [ ] **Step 7: Commit**

```bash
git add .husky/ package.json yarn.lock
git commit -m "chore: add Husky pre-commit (tsc + lint-staged) and pre-push (jest) hooks"
```

---

## Task 8: GitHub Actions — CI on PR

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflows directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create ci.yml**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  typecheck:
    name: TypeScript
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: npx tsc --noEmit

  lint:
    name: ESLint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: yarn lint

  test:
    name: Jest
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: yarn test:ci

  version-check:
    name: Version Bumped
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR version
        id: pr_version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

      - name: Get main version
        id: main_version
        run: |
          git fetch origin main
          echo "version=$(git show origin/main:package.json | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).version")" >> $GITHUB_OUTPUT

      - name: Fail if version not bumped
        run: |
          PR="${{ steps.pr_version.outputs.version }}"
          MAIN="${{ steps.main_version.outputs.version }}"
          echo "PR version: $PR"
          echo "Main version: $MAIN"
          if [ "$PR" = "$MAIN" ]; then
            echo "❌ Version not bumped. Current: $PR (same as main). Update version in package.json before merging."
            exit 1
          fi
          echo "✅ Version bumped: $MAIN → $PR"
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add PR quality gate (typecheck, lint, test, version-check)"
```

---

## Task 9: GitHub Actions — CD Release

**Files:**
- Create: `.github/workflows/release.yml`

Triggers on merge to main. Builds APK via EAS, publishes to GitHub Releases as `latest`.

- [ ] **Step 1: Create release.yml**

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  build-android:
    name: Build Android APK
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn

      - run: yarn install --frozen-lockfile

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build APK
        run: eas build --platform android --profile release --non-interactive --output ./release.apk

      - name: Get version
        id: version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

      - name: Create or update GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: latest
          name: "Latest Release (v${{ steps.version.outputs.version }})"
          body: |
            **Version:** ${{ steps.version.outputs.version }}
            **Built:** ${{ github.event.head_commit.timestamp }}
            **Commit:** ${{ github.sha }}

            Download the APK below and install on any Android device (enable "Install from unknown sources").
          files: release.apk
          make_latest: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add CD workflow — EAS Android APK build and GitHub Release on merge to main"
```

---

## Task 10: Verify Pipeline End-to-End

- [ ] **Step 1: Push branch and open a PR to main**

```bash
git push origin feat/splashscreen
```

Then open a PR on GitHub from `feat/splashscreen` → `main`.

- [ ] **Step 2: Verify CI jobs appear and pass**

In the PR, check that 4 status checks appear:
- `TypeScript` ✅
- `ESLint` ✅
- `Jest` ✅
- `Version Bumped` — should ❌ FAIL if version in `package.json` matches main

- [ ] **Step 3: Bump version and push**

In `package.json`, change `"version": "1.0.0"` to `"version": "1.1.0"`.

```bash
git add package.json
git commit -m "chore: bump version to 1.1.0"
git push
```

Expected: `Version Bumped` check passes ✅.

- [ ] **Step 4: Merge PR to main**

Merge via GitHub UI.

- [ ] **Step 5: Verify Release workflow runs**

Go to repo → **Actions** → **Release** workflow. Watch it run. Takes ~10min (EAS builds in cloud).

Expected: workflow completes, APK appears in **Releases** as `latest` with `release.apk` attachment.
