// Plus.jsx
// From https://heroicons.com/

import React from 'react';
import { Svg, Path } from 'react-native-svg';

const PlusIcon = ({ size = 24, color = 'black' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M12 4.5v15M19.5 12h-15"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusIcon;
