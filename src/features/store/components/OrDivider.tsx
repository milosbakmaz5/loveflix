import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { borderColors, spacing } from '@/theme';

export function OrDivider() {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text variant="label" color="secondary">
        {t('store.orBestDeal')}
      </Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: borderColors.default,
  },
});
