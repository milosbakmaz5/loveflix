import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import type { SheetOption } from '../utils/getSheetOptions';
import { UnlockOptionRow } from './UnlockOptionRow';

type UnlockOptionListProps = {
  options: readonly SheetOption[];
  selectedType: SheetOption['type'] | undefined;
  onSelect: (type: SheetOption['type']) => void;
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
