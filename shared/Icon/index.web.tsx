import Lottie, { LottieComponentProps } from "lottie-react";
import { FC } from "react";

interface IconProps {
  size?: number;
  source: LottieComponentProps["animationData"];
}

const Icon: FC<IconProps> = ({ size = 60, source }) => {
  return (
    <Lottie animationData={source} loop style={{ width: size, height: size }} />
  );
};

export default Icon;
