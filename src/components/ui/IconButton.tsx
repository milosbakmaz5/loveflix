import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { backgroundColors, borderColors, type IconColor, layout } from '@/theme';

import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

type IconButtonVariant = 'filled' | 'outline' | 'ghost';
type IconButtonSize = 'md' | 'lg';

type IconButtonProps = {
  icon: LucideIcon;
  /** Required: an icon alone says nothing to a screen reader. */
  accessibilityLabel: string;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: IconColor;
  selected?: boolean;
  disabled?: boolean;
};

const DIAMETER: Record<IconButtonSize, number> = { md: 40, lg: 48 };

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'outline',
  size = 'md',
  color = 'primary',
  selected,
  disabled = false,
}: IconButtonProps) {
  const diameter = DIAMETER[size];
  // Keep the touch area at least 44pt even when the circle is smaller.
  const slop = Math.max(0, (layout.minHitTarget - diameter) / 2);

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={selected === undefined ? undefined : { selected }}
    >
      <View
        style={[
          styles.circle,
          variantStyles[variant],
          { width: diameter, height: diameter, borderRadius: diameter / 2 },
          // Dimming lives on the inner view: PressableScale animates the outer opacity.
          disabled && styles.disabled,
        ]}
      >
        <Icon icon={icon} size={size === 'lg' ? 'lg' : 'md'} color={color} />
      </View>
    </PressableScale>
  );
}

const variantStyles = StyleSheet.create({
  filled: { backgroundColor: backgroundColors.overlay },
  outline: {
    backgroundColor: backgroundColors.overlay,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  ghost: { backgroundColor: backgroundColors.transparent },
} satisfies Record<IconButtonVariant, ViewStyle>);

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
});
