import React from 'react';
import { Svg, Rect, Circle, G } from 'react-native-svg';

const FileStack = ({ width = 300, height = 300, color = '#000', secondaryColor = '#fff' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
    >
      {/* Back layer (most transparent) */}
      <G opacity="0.3">
        <Rect x="65" y="45" width="80" height="100" rx="8" fill={color} />
      </G>

      {/* Middle layer */}
      <G opacity="0.6">
        <Rect x="60" y="50" width="80" height="100" rx="8" fill={color} />
      </G>

      {/* Front layer */}
      <Rect x="55" y="55" width="80" height="100" rx="8" fill={color} />

      {/* Form field lines (use secondaryColor!) */}
      <Rect x="70" y="75" width="50" height="5" rx="2.5" fill={secondaryColor} opacity="0.8" />
      <Rect x="70" y="90" width="50" height="5" rx="2.5" fill={secondaryColor} opacity="0.8" />
      <Rect x="70" y="105" width="35" height="5" rx="2.5" fill={secondaryColor} opacity="0.8" />
      <Rect x="70" y="120" width="50" height="5" rx="2.5" fill={secondaryColor} opacity="0.8" />
      <Circle cx="115" cy="107.5" r="3.5" fill={secondaryColor} opacity="0.8" />
    </Svg>
  );
};

export default FileStack;