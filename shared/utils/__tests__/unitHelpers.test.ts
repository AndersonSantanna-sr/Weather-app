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
