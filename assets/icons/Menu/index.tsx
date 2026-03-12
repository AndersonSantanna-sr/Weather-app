import React, { FC } from "react";
import Svg, { G, Path } from "react-native-svg";

type Props = {
  color: string;
  width: number;
  height: number;
};

const Menu: FC<Props> = ({ color, height, width }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512">
      <G transform="translate(0,512) scale(0.1,-0.1)" fill={color}>
        <Path d="M782 3829 c-49 -14 -118 -88 -132 -141 -26 -95 14 -196 98 -245 l47 -28 1765 0 1765 0 47 28 c84 49 124 149 97 244 -16 59 -81 127 -135 142 -51 14 -3504 14 -3552 0z" />
        <Path d="M1620 2754 c-167 -72 -165 -318 2 -389 33 -13 190 -15 1368 -15 1290 0 1332 1 1368 19 162 83 162 299 0 382 -36 18 -78 19 -1370 19 -1168 -1 -1337 -3 -1368 -16z" />
        <Path d="M2510 1701 c-104 -32 -160 -106 -160 -211 0 -84 53 -161 132 -194 33 -14 145 -16 924 -16 673 0 897 3 928 12 57 17 119 82 135 141 27 95 -13 195 -97 244 l-47 28 -895 2 c-492 1 -906 -2 -920 -6z" />
      </G>
    </Svg>
  );
};

export default Menu;
