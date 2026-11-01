import { StyleSheet, View } from 'react-native';

import type { UnlockOption, UnlockOptionType } from '@/domain';
import { spacing } from '@/theme';

import { UnlockOptionRow } from './UnlockOptionRow';

type UnlockOptionListProps = {
  options: readonly UnlockOption[];
  selectedType: UnlockOptionType | undefined;
  onSelect: (type: UnlockOptionType) => void;
};

export function UnlockOptionList({ options, selectedType, onSelect }: UnlockOptionListProps) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {options.map((option) => (
        <UnlockOptionRow
          key={option.type}
          option={option}
          isSelected={option.type === selectedType}
          onSelect={() => onSelect(option.type)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
