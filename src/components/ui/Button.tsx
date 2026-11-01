import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';

import {
  backgroundColors,
  borderColors,
  elevation,
  gradients,
  iconColors,
  type IconColor,
  radii,
  spacing,
  type TextColor,
} from '@/theme';

import { GradientText } from './GradientText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'premium' | 'ghost';
type ButtonSize = 'md' | 'lg';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `pill` for most CTAs; `rounded` for Unlock Now and the Buy button. */
  shape?: 'pill' | 'rounded';
  icon?: LucideIcon;
  /** Second line under the label ("for €6.99"). */
  sublabel?: string;
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
};

const CONTENT_COLORS: Record<ButtonVariant, { text: TextColor; icon: IconColor }> = {
  primary: { text: 'onBrand', icon: 'onBrand' },
  secondary: { text: 'primary', icon: 'primary' },
  premium: { text: 'primary', icon: 'primary' },
  ghost: { text: 'secondary', icon: 'secondary' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  shape = 'pill',
  icon,
  sublabel,
  loading = false,
  fullWidth = false,
  haptic = false,
}: ButtonProps) {
  const colors = CONTENT_COLORS[variant];
  const radius = shape === 'pill' ? radii.pill : radii.md;
  const sizeStyle = sublabel ? styles.withSublabel : styles[size];

  const content = (
    <View style={[styles.content, sizeStyle]}>
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color={iconColors[colors.icon]} />
        ) : (
          icon && <Icon icon={icon} size="md" color={colors.icon} />
        )}
        {variant === 'premium' ? (
          <GradientText variant="buttonLarge">{label}</GradientText>
        ) : (
          <Text variant="bodyStrong" color={colors.text}>
            {label}
          </Text>
        )}
      </View>
      {sublabel && (
        <Text variant="caption" color="secondary">
          {sublabel}
        </Text>
      )}
    </View>
  );

  return (
    <PressableScale
      onPress={onPress}
      disabled={loading}
      haptic={haptic}
      accessibilityRole="button"
      accessibilityLabel={sublabel ? `${label}, ${sublabel}` : label}
      accessibilityState={{ busy: loading }}
      style={fullWidth && styles.fullWidth}
    >
      {variant === 'premium' ? (
        // Gradient border: the gradient shows through a 1.5pt gap around the dark fill.
        <LinearGradient
          colors={gradients.premium}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          // Dimming lives on the inner view: PressableScale animates the outer opacity.
          style={[styles.gradientBorder, { borderRadius: radius }, loading && styles.inactive]}
        >
          <View style={[styles.premiumFill, { borderRadius: radius - GRADIENT_BORDER }]}>
            {content}
          </View>
        </LinearGradient>
      ) : (
        <View
          style={[
            surfaceStyles[variant],
            { borderRadius: radius },
            // The glow sits on the solid surface so iOS can compute the shadow cheaply.
            variant === 'primary' && !loading && elevation.glowPrimary,
            loading && styles.inactive,
          ]}
        >
          {content}
        </View>
      )}
    </PressableScale>
  );
}

const GRADIENT_BORDER = 1.5;

const surfaceStyles = StyleSheet.create({
  primary: { backgroundColor: backgroundColors.brand },
  secondary: {
    backgroundColor: backgroundColors.screen,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  premium: {},
  ghost: { backgroundColor: backgroundColors.transparent },
} satisfies Record<ButtonVariant, ViewStyle>);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  md: { minHeight: 44 },
  lg: { minHeight: 52 },
  withSublabel: { minHeight: 60, paddingVertical: spacing.xs },
  fullWidth: { alignSelf: 'stretch' },
  inactive: { opacity: 0.5 },
  gradientBorder: { padding: GRADIENT_BORDER },
  premiumFill: { backgroundColor: backgroundColors.surfaceRaised },
});
