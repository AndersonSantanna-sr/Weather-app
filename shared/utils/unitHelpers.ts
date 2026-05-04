import { TemperatureUnit, WindSpeedUnit } from '../types/units';

export const getTemperatureUnitLabel = (temperature: number, unit: TemperatureUnit): string => {
  if (unit === TemperatureUnit.CELSIUS) return String(temperature.toFixed(0)).concat('°C');
  return `${((temperature * 9) / 5 + 32).toFixed(0)}°F`;
};

export const formatWindSpeed = (kph: number, unit: WindSpeedUnit): string => {
  if (unit === WindSpeedUnit.MPH) return `${(kph * 0.621371).toFixed(0)} mph`;
  if (unit === WindSpeedUnit.MS) return `${(kph / 3.6).toFixed(1)} m/s`;
  return `${kph.toFixed(0)} km/h`;
};
