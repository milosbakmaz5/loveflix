import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { backgroundColors, borderColors, radii } from '@/theme';

type PriceTagProps = {
  price: string;
  isSelected: boolean;
};

/** Looks like a button, but the whole coin pack card is the touch target. */
export function PriceTag({ price, isSelected }: PriceTagProps) {
  return (
    <View style={[styles.tag, isSelected && styles.selected]}>
      <Text variant="bodySmall" color={isSelected ? 'onBrand' : 'primary'}>
        {price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'stretch',
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
    backgroundColor: backgroundColors.screen,
  },
  selected: {
    borderColor: borderColors.selected,
    backgroundColor: backgroundColors.brand,
  },
});
