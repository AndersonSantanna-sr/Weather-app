import { TemperatureUnit } from '../types/units';

export function convertTemperature(temperature: number, unit: TemperatureUnit): number {
  if (unit === TemperatureUnit.CELSIUS) return temperature;

  return (temperature * 9) / 5 + 32;
}
