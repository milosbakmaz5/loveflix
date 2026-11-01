import type { ViewStyle } from 'react-native';

import { shadowColors } from './colors';

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type IconSize = keyof typeof iconSizes;

export const layout = {
  screenGutter: spacing.md,
  sectionGap: spacing.xxl,
  minHitTarget: 44,
  /** Content row of every Header, without the top safe area. */
  headerHeight: 56,
  /** Content row of the tab bar, without the bottom safe area. */
  tabBarHeight: 56,
} as const;

export const elevation = {
  glowPrimary: {
    shadowColor: shadowColors.brandGlow,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
} as const satisfies Record<string, ViewStyle>;
