import type { LucideIcon } from 'lucide-react-native';

import { iconColors, type IconColor, type IconSize, iconSizes } from '@/theme';

type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
};

/** Lucide icon limited to the design tokens. Decorative: give the parent the a11y label. */
export function Icon({ icon: LucideComponent, size = 'md', color = 'primary' }: IconProps) {
  return (
    <LucideComponent
      size={iconSizes[size]}
      color={iconColors[color]}
      strokeWidth={2}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
