import { ThunderstormsJson } from "@/assets/animations";
import Icon from "@/shared/Icon";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  time: string;
  icon: string;
  temperature: string;
};

const HourlyForecastCard: FC<Props> = ({ time, icon, temperature }) => {
  return (
    <View style={styles.container}>
      <Text>{temperature}</Text>
      <Icon source={ThunderstormsJson} />
      <Text>{time}</Text>
    </View>
  );
};

export default HourlyForecastCard;
