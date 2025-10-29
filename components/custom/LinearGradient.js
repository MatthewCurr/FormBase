// LinearGradient.js - Gradient Background Component

// ======================
// Imports
// ======================
import React from 'react';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';

// ======================
// Enable Tailwind support for ExpoLinearGradient
// ======================
cssInterop(ExpoLinearGradient, { className: 'style' });

// ======================
// Exported Component
// ======================
export const LinearGradient = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ExpoLinearGradient {...props} className={className} ref={ref} />
    );
  }
);