import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESSED_SCALE = 0.97;
const PRESSED_OPACITY = 0.9;

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  /** Light haptic tap on press. Only for the main actions (Watch, Unlock Now, Buy). */
  haptic?: boolean;
  children: ReactNode;
};

/** Shared press feedback: shrinks and fades slightly while pressed (UI thread). */
export function PressableScale({
  style,
  haptic = false,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  accessibilityState,
  children,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.get() * (1 - PRESSED_OPACITY),
    transform: [{ scale: 1 - pressed.get() * (1 - PRESSED_SCALE) }],
  }));

  function handlePressIn(event: GestureResponderEvent) {
    pressed.set(withTiming(1, { duration: 100 }));
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    pressed.set(withTiming(0, { duration: 160 }));
    onPressOut?.(event);
  }

  function handlePress(event: GestureResponderEvent) {
    if (haptic) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(event);
  }

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityState={{ ...accessibilityState, disabled: disabled ?? false }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
