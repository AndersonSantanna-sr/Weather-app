import LottieView from 'lottie-react-native';
import animationData from '../../animations/thunderstorms-day-extreme-rain.json';
export default function SunIcon() {
  return <LottieView source={animationData} autoPlay loop style={{ width: 120, height: 120 }} />;
}
