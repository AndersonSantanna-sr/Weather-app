import React, { FC } from "react";
import { WeatherHour } from "../../types/weather";
import SectionTime from "./SectionTime";

type Props = {
  data: WeatherHour[];
};

const SectionTimeContainer: FC<Props> = ({ data }) => {
  return <SectionTime data={data} />;
};

export default SectionTimeContainer;
