import LottieView from "lottie-react-native";
import animationData from "../../animations/partly-cloudy-day.json";
export default function PartlyCloudyDayIcon() {
  return (
    <LottieView
      source={animationData}
      autoPlay
      loop
      style={{ width: 120, height: 120 }}
    />
  );
}
