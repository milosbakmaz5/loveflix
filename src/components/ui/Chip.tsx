import { StyleSheet } from 'react-native';

import { backgroundColors, borderColors, radii, spacing } from '@/theme';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** Selectable filter pill (genre chips). */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={{ top: 6, bottom: 6 }}
      style={[styles.chip, selected ? styles.selected : styles.idle]}
    >
      <Text variant="bodySmall" color={selected ? 'onBrand' : 'primary'}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  idle: {
    backgroundColor: backgroundColors.surface,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
  selected: {
    backgroundColor: backgroundColors.brand,
  },
});
