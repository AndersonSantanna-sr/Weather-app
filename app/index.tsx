import Header from "@/components/Header/Header";
import {
  WEATHER_GRADIENTS,
  WeatherCondition,
} from "@/constants/WeatherGradients";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function TabOneScreen() {
  const weatherCondition = WeatherCondition.STORMY; // This would typically come from your app's state or props
  const gradient = WEATHER_GRADIENTS[weatherCondition];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient.colors}
        locations={[0, 1]}
        style={[StyleSheet.absoluteFill]}
        children={<Header />}
      />

      <View
        style={[styles.cloudEffect, { backgroundColor: gradient.cloudColor }]}
      >
        <Text style={styles.title}>Weather App</Text>
        <Text style={styles.temp}>29°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cloudEffect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.9,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    zIndex: 1,
  },
  temp: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#4A6FA5",
    marginTop: 20,
    zIndex: 1,
  },
});
