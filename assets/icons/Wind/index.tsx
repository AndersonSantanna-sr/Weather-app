import LottieView from "lottie-react-native";
import animationData from "../../animations/wind.json";
export default function WindIcon() {
  return (
    <LottieView
      source={animationData}
      autoPlay
      loop
      style={{ width: 60, height: 60 }}
    />
  );
}
