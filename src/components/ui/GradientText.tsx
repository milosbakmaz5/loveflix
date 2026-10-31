import NativeMaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentType, ReactElement } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';

import { type GradientName, gradients, type TypographyVariant } from '@/theme';

import { Text } from './Text';

// masked-view 0.3 types its export as a mixin class, which React 19's JSX types reject.
// The runtime component is fine; this restores its documented props.
const MaskedView = NativeMaskedView as unknown as ComponentType<
  ViewProps & { maskElement: ReactElement }
>;

type GradientTextProps = {
  children: string;
  variant?: TypographyVariant;
  gradient?: GradientName;
  accessibilityRole?: 'header' | 'text';
};

/** Text filled with a left-to-right gradient ("Romance" category heading, Buy button label). */
export function GradientText({
  children,
  variant = 'h1',
  gradient = 'premium',
  accessibilityRole = 'text',
}: GradientTextProps) {
  return (
    <MaskedView
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={children}
      style={styles.fitToText}
      maskElement={<Text variant={variant}>{children}</Text>}
    >
      <LinearGradient colors={gradients[gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {/* Invisible copy that gives the gradient the exact size of the text. */}
        <Text variant={variant} style={styles.sizer}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  // Without this the gradient spans the parent's full width and the text only shows its start.
  fitToText: {
    alignSelf: 'flex-start',
  },
  sizer: {
    opacity: 0,
  },
});
