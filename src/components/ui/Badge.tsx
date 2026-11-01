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
  type TypographyVariant,
  borderColors,
} from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

export type BadgeVariant = 'pro' | 'spotlight' | 'popular' | 'bestValue' | 'locked';

type BadgeSpec = {
  labelKey: `badges.${BadgeVariant}`;
  text: TextColor;
  textVariant?: TypographyVariant;
  icon?: { component: LucideIcon; color: IconColor };
};

const SPECS: Record<BadgeVariant, BadgeSpec> = {
  pro: { labelKey: 'badges.pro', text: 'onBrand', icon: { component: Crown, color: 'onBrand' } },
  spotlight: { labelKey: 'badges.spotlight', text: 'accent', textVariant: 'caption' },
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
      <Text variant={spec.textVariant ?? 'badge'} color={spec.text}>
        {t(spec.labelKey)}
      </Text>
    </>
  );

  if (variant === 'pro' || variant === 'bestValue') {
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
  pro: {},
  spotlight: {
    backgroundColor: backgroundColors.accentSubtle,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
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
