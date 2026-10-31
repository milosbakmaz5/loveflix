import { StyleSheet, View } from 'react-native';

import { backgroundColors, borderColors, radii, spacing } from '@/theme';

import { Text } from './Text';

type TagProps = {
  label: string;
  /** `outline`: genre tags on the series hero. `subtle`: "Ep 5", episode count. */
  variant?: 'outline' | 'subtle';
};

/** Small non-interactive label. */
export function Tag({ label, variant = 'subtle' }: TagProps) {
  return (
    <View style={[styles.tag, variant === 'outline' ? styles.outline : styles.subtle]}>
      <Text variant="caption" color="primary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
  },
  outline: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    backgroundColor: backgroundColors.overlay,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  subtle: {
    backgroundColor: backgroundColors.subtle,
  },
});
