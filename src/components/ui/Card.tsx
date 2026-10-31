import type { ReactNode } from 'react';
import {
  type AccessibilityRole,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { backgroundColors, borderColors, radii, spacing } from '@/theme';

import { PressableScale } from './PressableScale';

type CardProps = {
  children: ReactNode;
  variant?: 'surface' | 'raised';
  /** Cyan outline + highlighted fill. */
  selected?: boolean;
  /** `brand` = teal fill (selected coin pack); `default` = slate (selected unlock option). */
  selectedTone?: 'default' | 'brand';
  padding?: keyof typeof spacing;
  onPress?: () => void;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  variant = 'surface',
  selected = false,
  selectedTone = 'default',
  padding = 'md',
  onPress,
  accessibilityRole = 'button',
  accessibilityLabel,
  style,
}: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'raised' && styles.raised,
    selected && styles.selected,
    selected && selectedTone === 'brand' && styles.selectedBrand,
    { padding: spacing[padding] },
    style,
  ];

  if (!onPress) {
    return <View style={cardStyle}>{children}</View>;
  }
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      style={cardStyle}
    >
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  raised: {
    backgroundColor: backgroundColors.surfaceRaised,
  },
  selected: {
    backgroundColor: backgroundColors.surfaceSelected,
    borderColor: borderColors.selected,
  },
  selectedBrand: {
    backgroundColor: backgroundColors.surfaceSelectedBrand,
  },
});
