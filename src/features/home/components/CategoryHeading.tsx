import { StyleSheet, View } from 'react-native';

import { GradientText, Text } from '@/components/ui';
import { backgroundColors, layout, spacing } from '@/theme';

import { CATEGORY_ROW_HEIGHT } from '../utils/homeRows';

type CategoryHeadingProps = {
  title: string;
  /** Cyan square + gradient title; otherwise white square + white title. */
  highlighted: boolean;
};

const SQUARE_SIZE = 24;

export function CategoryHeading({ title, highlighted }: CategoryHeadingProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.square, highlighted ? styles.squareBrand : styles.squareInverse]} />
      {highlighted ? (
        // GradientText sizes itself to its text; the wrapper lets the row center it.
        <View>
          <GradientText variant="h1" accessibilityRole="header">
            {title}
          </GradientText>
        </View>
      ) : (
        <Text variant="h1" accessibilityRole="header">
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: CATEGORY_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.xs,
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
  },
  squareBrand: {
    backgroundColor: backgroundColors.brand,
  },
  squareInverse: {
    backgroundColor: backgroundColors.inverse,
  },
});
