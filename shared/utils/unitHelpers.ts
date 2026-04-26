import { TemperatureUnit } from '../types/units';

export const getTemperatureUnitLabel = (temperature: number, unit: TemperatureUnit): string => {
  if (unit === TemperatureUnit.CELSIUS) return String(temperature.toFixed(0)).concat('°C');

  return String((temperature * 9) / 5 + 32).concat('°F');
};
