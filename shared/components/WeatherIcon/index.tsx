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
import { WeatherCondition } from '@/shared/constants/WeatherGradients';
import type { FC } from 'react';
import React from 'react';
import Icon from '../Icon';

type Props = {
  iconName?: string;
  size?: number;
};

const WeatherIcon: FC<Props> = ({ iconName, size }) => {
  const getIconJson = () => {
    switch (iconName) {
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
  };

  return <Icon source={getIconJson()} size={size} />;
};

export default WeatherIcon;
