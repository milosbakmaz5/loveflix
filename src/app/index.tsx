import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { backgroundColors, spacing } from '@/theme';

// Temporary placeholder until the Home feed lands (phase 3).
export default function Index() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="display" color="brand">
        {t('app.name')}
      </Text>
      <Text variant="body" color="secondary" align="center">
        {t('app.tagline')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: backgroundColors.screen,
  },
});
