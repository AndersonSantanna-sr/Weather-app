import LottieView from "lottie-react-native";
import animationData from "../../animations/rain.json";
export default function RainIcon() {
  return (
    <LottieView
      source={animationData}
      autoPlay
      loop
      style={{ width: 120, height: 120 }}
    />
  );
}
