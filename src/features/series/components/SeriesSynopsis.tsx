import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { SectionHeader, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

type SeriesSynopsisProps = {
  synopsis: string;
};

export function SeriesSynopsis({ synopsis }: SeriesSynopsisProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <SectionHeader title={t('series.synopsis')} />
      <Text variant="body" color="secondary" style={styles.text}>
        {synopsis}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xs,
  },
  text: {
    paddingHorizontal: layout.screenGutter,
  },
});
