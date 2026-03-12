import ThunderstormIcon from "@/assets/icons/ThunderstormIcon";
import React, { FC } from "react";
import { View } from "react-native";
import { styles } from "./styles";

type Props = {};

const StatusIcon: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <ThunderstormIcon />
    </View>
  );
};

export default StatusIcon;
