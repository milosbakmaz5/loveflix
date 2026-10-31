import { Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing, type TextColor } from '@/theme';

import { Text } from './Text';

export type MetaItem = {
  key: string;
  content: ReactNode;
};

type MetaRowProps = {
  items: readonly MetaItem[];
  color?: TextColor;
};

/** Inline meta separated by dots: "★ 4.8 • 72 Episodes", "Ep 5 • 2:10". */
export function MetaRow({ items, color = 'secondary' }: MetaRowProps) {
  return (
    <View style={styles.row}>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 && (
            <Text variant="bodySmall" color="muted" accessibilityElementsHidden>
              •
            </Text>
          )}
          {typeof item.content === 'string' ? (
            <Text variant="bodySmall" color={color}>
              {item.content}
            </Text>
          ) : (
            item.content
          )}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
