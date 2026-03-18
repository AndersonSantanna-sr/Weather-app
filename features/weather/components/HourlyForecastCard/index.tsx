import type { FC } from 'react';
import React from 'react';
import HourlyForecastCard from './HourlyForecastCard';

type Props = {
  time: string;
  icon: string;
  temperature: string;
};

const HourlyForecastCardContainer: FC<Props> = ({ time, icon, temperature }) => {
  return <HourlyForecastCard temperature={temperature} icon={icon} time={time} />;
};

export default HourlyForecastCardContainer;
