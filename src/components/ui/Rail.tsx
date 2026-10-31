import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { layout, spacing } from '@/theme';

type RailProps<T> = {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  /** Fixed row height: a horizontal list inside a vertical list must not size itself. */
  height: number;
  accessibilityLabel?: string;
};

/** Horizontal FlashList with gutter padding. Define `renderItem` outside render so cells recycle. */
export function Rail<T>({
  data,
  renderItem,
  keyExtractor,
  height,
  accessibilityLabel,
}: RailProps<T>) {
  return (
    <View style={{ height }} accessibilityLabel={accessibilityLabel}>
      <FlashList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={RailSeparator}
      />
    </View>
  );
}

function RailSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenGutter,
  },
  separator: {
    width: spacing.sm,
  },
});
