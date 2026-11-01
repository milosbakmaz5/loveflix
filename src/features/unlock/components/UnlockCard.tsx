import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { backgroundColors, borderColors, radii, spacing } from '@/theme';

type UnlockCardProps = {
  children: ReactNode;
};

/** The floating card over the dimmed player. Tapping outside closes it. */
export function UnlockCard({ children }: UnlockCardProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.xs, paddingBottom: insets.bottom + spacing.xs },
      ]}
    >
      {/* Plain Pressable: shrinking the whole backdrop on press would look broken. */}
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
        onPress={() => router.back()}
      />
      <View style={styles.card} accessibilityViewIsModal>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: backgroundColors.scrimStrong,
  },
  card: {
    flexShrink: 1,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
    backgroundColor: backgroundColors.surfaceRaised,
    overflow: 'hidden',
  },
});
