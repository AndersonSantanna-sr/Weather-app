import { HumidityJson, ThermometerJson, WindJson } from "@/assets/animations";
import Icon from "@/shared/Icon";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {};

const WeatherInfo: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Icon source={WindJson} />
        <Text style={styles.subtitle}>Wind now</Text>
        <Text style={styles.valueText}>10 KM</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={ThermometerJson} />
        <Text style={styles.subtitle}>Feels</Text>
        <Text style={styles.valueText}>35°C</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon source={HumidityJson} />
        <Text style={styles.subtitle}>Humidity</Text>
        <Text style={styles.valueText}>90%</Text>
      </View>
    </View>
  );
};

export default WeatherInfo;
