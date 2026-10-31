import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Lock, type LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import {
  backgroundColors,
  gradients,
  type IconColor,
  radii,
  spacing,
  type TextColor,
} from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

export type BadgeVariant = 'pro' | 'spotlight' | 'popular' | 'bestValue' | 'locked';

type BadgeSpec = {
  labelKey: `badges.${BadgeVariant}`;
  text: TextColor;
  icon?: { component: LucideIcon; color: IconColor };
};

const SPECS: Record<BadgeVariant, BadgeSpec> = {
  pro: { labelKey: 'badges.pro', text: 'primary', icon: { component: Crown, color: 'primary' } },
  spotlight: { labelKey: 'badges.spotlight', text: 'primary' },
  popular: { labelKey: 'badges.popular', text: 'onBrand' },
  bestValue: { labelKey: 'badges.bestValue', text: 'onBrand' },
  locked: {
    labelKey: 'badges.locked',
    text: 'primary',
    icon: { component: Lock, color: 'primary' },
  },
};

type BadgeProps = {
  variant: BadgeVariant;
};

export function Badge({ variant }: BadgeProps) {
  const { t } = useTranslation();
  const spec = SPECS[variant];
  const content = (
    <>
      {spec.icon && <Icon icon={spec.icon.component} size="sm" color={spec.icon.color} />}
      <Text variant="badge" color={spec.text}>
        {t(spec.labelKey)}
      </Text>
    </>
  );

  if (variant === 'bestValue') {
    return (
      <LinearGradient
        colors={gradients.premium}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badge}
      >
        {content}
      </LinearGradient>
    );
  }
  return <View style={[styles.badge, variantStyles[variant]]}>{content}</View>;
}

const variantStyles = StyleSheet.create({
  pro: { backgroundColor: backgroundColors.accent },
  spotlight: { backgroundColor: backgroundColors.accent },
  popular: { backgroundColor: backgroundColors.brand },
  bestValue: {},
  locked: { backgroundColor: backgroundColors.overlay },
} satisfies Record<BadgeVariant, ViewStyle>);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
});
