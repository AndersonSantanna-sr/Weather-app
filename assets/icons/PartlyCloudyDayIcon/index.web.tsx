import Lottie from 'lottie-react';
import animationData from '../../animations/partly-cloudy-day.json';

export default function PartlyCloudyDayIcon() {
  return <Lottie animationData={animationData} loop style={{ width: 120, height: 120 }} />;
}
