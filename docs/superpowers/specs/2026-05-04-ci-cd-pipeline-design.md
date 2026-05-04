# CI/CD Pipeline & Unit Tests — Implementation Design

## Goal

Add a quality gate pipeline (local + remote) and automated Android release for the weather-app portfolio project.

## Architecture

Four layers, each building on the previous:

1. **Local hooks (Husky)** — block bad commits before they leave the machine
2. **CI on PR (GitHub Actions)** — block bad merges before they reach main
3. **CD on merge (GitHub Actions + EAS)** — publish APK to GitHub Releases automatically
4. **Unit tests (Jest)** — the test suite that CI and local hooks both run

---

## Section 1: Unit Tests

### Framework

- **Jest** with `@testing-library/react-native` and `jest-expo` preset
- `jest-expo` handles Expo module mocking (MMKV, expo-notifications, etc.) out of the box

### Test targets

| File | What to test |
|---|---|
| `shared/utils/unitHelpers.ts` | `getTemperatureUnitLabel`: °C→°F conversion, label format |
| `shared/utils/notificationHelpers.ts` | `scheduleWeatherNotifications`: early-return when all disabled, skips past dates, calls scheduleNotificationAsync correct number of times |
| `shared/store/useSettings.ts` | Each setter updates state correctly; persisted defaults are correct |
| `features/weather/hooks/useWeather.ts` | Loading state, success state with mocked axios, error state with mocked axios |

### What is NOT tested (v1)

- Visual components (high cost, low value without Detox/E2E)
- Navigation flows
- Splash screen animation

### Coverage target

- `shared/utils/` → 100% line coverage
- `shared/store/` → happy paths + each setter
- `features/weather/hooks/` → loading, success, error

### Config location

- `jest.config.js` at root
- Test files alongside source: `__tests__/` folders or `*.test.ts` next to files

---

## Section 2: Husky (local quality gate)

### Hooks

**pre-commit** (runs on every commit, only on staged files via `lint-staged`):
1. `eslint --fix` on staged `.ts/.tsx` files
2. `tsc --noEmit` on full project

**pre-push** (runs before push to any branch):
1. `jest --passWithNoTests` — full test suite

### Why lint-staged on pre-commit

Runs ESLint only on changed files — fast enough to not annoy on every commit. TypeScript check runs on the full project because type errors can come from unchanged files.

---

## Section 3: CI on Pull Request

**Trigger:** `pull_request` targeting `main`

**Jobs (parallel):**

| Job | Command | Blocks merge if |
|---|---|---|
| `typecheck` | `tsc --noEmit` | any TS error |
| `lint` | `eslint .` | any lint error |
| `test` | `jest --ci --coverage` | any test failure |
| `version-check` | compare `package.json` version vs main | version unchanged |

**version-check logic:**
- Checkout PR branch, read `package.json` version
- Checkout main, read `package.json` version
- If equal → fail with message: `❌ Version not bumped. Current: X.Y.Z (same as main). Update package.json before merging.`
- If different → pass

**No Android build on PR** — too slow, unnecessary for quality gate.

---

## Section 4: CD on Merge to Main

**Trigger:** `push` to `main` (fires after PR merge)

**Job: `build-android`**

Steps:
1. Checkout repo
2. Setup Node + install dependencies
3. `eas build --platform android --profile release --non-interactive --output ./release.apk`
4. Download APK from EAS (EAS CLI does this automatically with `--output`)
5. Create or update GitHub Release tagged `latest` with APK as artifact

**Release strategy:** single `latest` release, overwritten on every merge. Clean for portfolio — visitors always download the current APK. Version bumps in `package.json` are the semantic marker; the tag stays `latest`.

### EAS profile (`eas.json`)

```json
{
  "cli": { "version": ">= 16.0.0" },
  "build": {
    "release": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Secrets required (GitHub → Settings → Secrets)

| Secret | Value |
|---|---|
| `EXPO_TOKEN` | Personal access token from expo.dev |
| `WEATHER_API_KEY` | WeatherAPI key — added to EAS via `eas secret:create --scope project --name WEATHER_API_KEY --value <key>` |

EAS manages the Android keystore automatically — no manual signing setup needed.

---

## File structure

```
.husky/
  pre-commit
  pre-push
.github/
  workflows/
    ci.yml        # PR checks
    release.yml   # CD on merge to main
eas.json
jest.config.js
shared/utils/__tests__/
  unitHelpers.test.ts
  notificationHelpers.test.ts
shared/store/__tests__/
  useSettings.test.ts
features/weather/hooks/__tests__/
  useWeather.test.ts
```

---

## Dependencies to add

| Package | Type | Purpose |
|---|---|---|
| `jest-expo` | devDep | Jest preset for Expo |
| `@testing-library/react-native` | devDep | Component/hook testing utils |
| `@testing-library/jest-native` | devDep | Custom matchers |
| `husky` | devDep | Git hooks |
| `lint-staged` | devDep | Run linters on staged files only |
| `eas-cli` | global / CI | EAS build commands |
