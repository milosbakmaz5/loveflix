import { Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { spacing } from '@/theme';

/** Stands in for the advertiser's video, so the demo needs no network here. */
export function MockAdCreative() {
  const { t } = useTranslation();

  return (
    <View style={styles.creative}>
      <Icon icon={Sparkles} size="xl" color="accent" />
      <Text variant="h1" align="center">
        {t('ad.headline')}
      </Text>
      <Text variant="body" color="secondary" align="center">
        {t('ad.body')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  creative: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
});
