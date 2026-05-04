import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '@/shared/types/units';

jest.mock('@/lib/storage/storage', () => {
  const store: Record<string, string> = {};
  return {
    zustandStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    },
  };
});

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
    const state = useSettings.getState();
    expect(state.temperatureUnit).toBe(TemperatureUnit.CELSIUS);
    expect(state.windSpeedUnit).toBe(WindSpeedUnit.KPH);
    expect(state.rainAlertEnabled).toBe(false);
    expect(state.rainAlertThreshold).toBe(50);
    expect(state.temperatureAlertThreshold).toBe(35);
  });
});

describe('useSettings setters', () => {
  it('setTemperatureUnit updates unit', () => {
    const { setTemperatureUnit } = useSettings.getState();
    setTemperatureUnit(TemperatureUnit.FAHRENHEIT);
    expect(useSettings.getState().temperatureUnit).toBe(TemperatureUnit.FAHRENHEIT);
  });

  it('setRainAlertEnabled toggles value', () => {
    const { setRainAlertEnabled } = useSettings.getState();
    setRainAlertEnabled(true);
    expect(useSettings.getState().rainAlertEnabled).toBe(true);
  });

  it('setRainAlertThreshold updates threshold', () => {
    const { setRainAlertThreshold } = useSettings.getState();
    setRainAlertThreshold(70);
    expect(useSettings.getState().rainAlertThreshold).toBe(70);
  });

  it('setTemperatureAlertThreshold updates threshold', () => {
    const { setTemperatureAlertThreshold } = useSettings.getState();
    setTemperatureAlertThreshold(40);
    expect(useSettings.getState().temperatureAlertThreshold).toBe(40);
  });

  it('setDailySummaryEnabled toggles value', () => {
    const { setDailySummaryEnabled } = useSettings.getState();
    setDailySummaryEnabled(true);
    expect(useSettings.getState().dailySummaryEnabled).toBe(true);
  });
});
