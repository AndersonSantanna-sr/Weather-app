import Lottie from 'lottie-react';
import animationData from '../../animations/thunderstorms-day-extreme-rain.json';

export default function ThunderstormIcon() {
  return <Lottie animationData={animationData} loop style={{ width: 120, height: 120 }} />;
}
