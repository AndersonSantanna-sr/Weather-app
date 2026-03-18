import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { type FC } from 'react';

interface IconProps {
  size?: number;
  source: LottieViewProps['source'];
}

const Icon: FC<IconProps> = ({ size = 60, source }) => {
  return <LottieView source={source} autoPlay loop style={{ width: size, height: size }} />;
};

export default Icon;
