import Lottie from "lottie-react";
import animationData from "../../animations/wind.json";

export default function WindIcon() {
  return (
    <Lottie
      animationData={animationData}
      loop
      style={{ width: 60, height: 60 }}
    />
  );
}
