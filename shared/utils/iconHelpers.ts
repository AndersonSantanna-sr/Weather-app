import {
  ClearDayJson,
  ClearNightJson,
  DrizzleJson,
  FogJson,
  PartlyCloudyJson,
  RainJson,
  SnowJson,
  ThunderstormsJson,
} from '@/assets/animations';
import { WeatherCondition } from '../constants/WeatherGradients';

export function getWeatherIcon(condition: WeatherCondition) {
  switch (condition) {
    case WeatherCondition.STORMY:
      return ThunderstormsJson;
    case WeatherCondition.SUNNY:
      return ClearDayJson;
    case WeatherCondition.CLOUDY:
      return PartlyCloudyJson;
    case WeatherCondition.RAINY:
      return RainJson;
    case WeatherCondition.SNOWY:
      return SnowJson;
    case WeatherCondition.FOGGY:
      return FogJson;
    case WeatherCondition.CLEAR_NIGHT:
      return ClearNightJson;
    case WeatherCondition.DRIZZLE:
      return DrizzleJson;
    default:
      return ThunderstormsJson;
  }
}

export function mapCodeToCondition(code: number, isDay: boolean): WeatherCondition {
  if (code === 1000) {
    return isDay ? WeatherCondition.SUNNY : WeatherCondition.CLEAR_NIGHT;
  }

  if ([1003, 1006, 1009].includes(code)) {
    return WeatherCondition.CLOUDY;
  }

  if ([1030, 1135, 1147].includes(code)) {
    return WeatherCondition.FOGGY;
  }

  if ([1063, 1180, 1183, 1186, 1189].includes(code)) {
    return WeatherCondition.DRIZZLE;
  }

  if ([1192, 1195, 1240, 1243, 1246].includes(code)) {
    return WeatherCondition.RAINY;
  }

  if ([1273, 1276, 1279, 1282].includes(code)) {
    return WeatherCondition.STORMY;
  }

  if ([1066, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) {
    return WeatherCondition.SNOWY;
  }

  return WeatherCondition.SUNNY; // fallback
}
