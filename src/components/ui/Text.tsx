import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { textColors, typography, type TextColor, type TypographyVariant } from '@/theme';

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', color = 'primary', align, style, ...rest }: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        styles.base,
        { color: textColors[color] },
        align && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
