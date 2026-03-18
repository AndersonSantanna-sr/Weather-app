import Lottie from 'lottie-react';
import animationData from '../../animations/rain.json';

export default function RainIcon() {
  return <Lottie animationData={animationData} loop style={{ width: 120, height: 120 }} />;
}
