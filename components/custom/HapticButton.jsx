import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * A reusable button with haptic feedback on press.
 *
 * @param {Object} props
 * @param {Function} props.onPress - Function to call when pressed.
 * @param {React.ReactNode} props.children - Content inside the button.
 * @param {string} [props.haptic="medium"] - Haptic strength: "light", "medium", or "heavy".
 * @param {string} [props.className] - NativeWind class names.
 * @param {Object} [props.style] - Inline style overrides.
 * @param {boolean} [props.disabled=false] - Disable button press.
 * @param {number} [props.activeOpacity=0.7] - Touch feedback opacity.
 */
export default function HapticButton({
  onPress,
  children,
  haptic = 'medium',
  className,
  style,
  disabled = false,
  activeOpacity = 0.7,
}) {
  const handlePress = async () => {
    try {
      // Trigger the appropriate haptic feedback
      switch (haptic.toLowerCase()) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Call user onPress handler
      if (onPress) onPress();
    } catch (err) {
      console.warn('HapticButton error:', err);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      className={
        `p-1 rounded-lg items-center justify-center flex-row ${className}`
      }
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
}