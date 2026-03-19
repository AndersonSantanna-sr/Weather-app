import Lottie, { type LottieComponentProps } from 'lottie-react';
import { type FC } from 'react';

interface IconProps {
  size?: number;
  source: LottieComponentProps['animationData'];
}

const Icon: FC<IconProps> = ({ size = 60, source }) => {
  return <Lottie animationData={source} loop style={{ width: size, height: size }} />;
};

export default Icon;
