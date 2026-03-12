import Lottie from "lottie-react";
import animationData from "../../animations/clear-day.json";

export default function SunIcon() {
  return (
    <Lottie
      animationData={animationData}
      loop
      style={{ width: 120, height: 120 }}
    />
  );
}
