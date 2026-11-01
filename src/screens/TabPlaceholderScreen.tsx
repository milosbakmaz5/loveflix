import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { EmptyState, Header, Screen } from '@/components/ui';
import { spacing } from '@/theme';

type TabPlaceholderScreenProps = {
  title: string;
  children?: ReactNode;
};

/** Tabs outside the brief's scope: the design's tab exists, the screen doesn't. */
export function TabPlaceholderScreen({ title, children }: TabPlaceholderScreenProps) {
  const { t } = useTranslation();
  return (
    <Screen>
      <Header title={title} />
      <EmptyState message={t('common.comingSoon')} />
      {children && <View style={styles.actions}>{children}</View>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    padding: spacing.xl,
  },
});
