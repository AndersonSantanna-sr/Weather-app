import React, { type FC } from 'react';
import { type WeatherHour } from '../../types/weather';
import SectionTime from './SectionDays';

type Props = {
  data: WeatherHour[];
};

const SectionTimeContainer: FC<Props> = ({ data }) => {
  return <SectionTime data={data} />;
};

export default SectionTimeContainer;
