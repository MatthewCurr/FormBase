import React from 'react';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';

cssInterop(ExpoLinearGradient, { className: 'style' });

export const LinearGradient = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ExpoLinearGradient {...props} className={className} ref={ref} />
    );
  }
);