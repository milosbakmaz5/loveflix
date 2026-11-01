import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { layout, spacing } from '@/theme';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type SectionHeaderProps = {
  title: string;
  /** `h2` for page sections ("Synopsis"), `h3` for rails ("Trending Romance"). */
  variant?: 'h2' | 'h3';
  /** Shown right after the title, e.g. the episode count tag. */
  accessory?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({
  title,
  variant = 'h2',
  accessory,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.title}>
        <Text variant={variant} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        <View>{accessory}</View>
      </View>
      {actionLabel && onAction && (
        <PressableScale
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}, ${title}`}
          hitSlop={spacing.sm}
          style={styles.action}
        >
          <Text variant="bodySmall" color="brand">
            {actionLabel}
          </Text>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: layout.screenGutter,
  },
  title: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  action: {
    minHeight: layout.minHitTarget,
    justifyContent: 'center',
  },
});
