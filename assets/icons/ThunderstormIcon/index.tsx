import LottieView from "lottie-react-native";
import animationData from "../../animations/thunderstorms-day-extreme-rain.json";
export default function ThunderstormIcon() {
  return (
    <LottieView
      source={animationData}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
