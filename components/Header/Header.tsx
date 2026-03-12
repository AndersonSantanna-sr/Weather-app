import Menu from "@/assets/icons/Menu";
import React, { FC } from "react";
import { Text, View } from "react-native";
import StatusIcon from "../StatusIcon";
import { styles } from "./styles";

type Props = {};

const Header: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Indaiatuba</Text>
        <Menu color="white" width={24} height={24} />
      </View>
      <Text style={styles.description}>10 March, Tuesday</Text>
      <StatusIcon />
    </View>
  );
};

export default Header;
