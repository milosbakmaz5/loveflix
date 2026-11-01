import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { getPosterCardHeight, PosterCard, Rail, SectionHeader } from '@/components/ui';
import type { Series } from '@/domain';
import { spacing } from '@/theme';

type RelatedSeriesRailProps = {
  series: readonly Series[];
};

function openSeries(series: Series) {
  router.push({ pathname: '/series/[id]', params: { id: series.id } });
}

function renderPoster({ item }: { item: Series }) {
  return <PosterCard series={item} size="lg" onPress={openSeries} />;
}

function getSeriesKey(series: Series) {
  return series.id;
}

export function RelatedSeriesRail({ series }: RelatedSeriesRailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <SectionHeader title={t('series.related')} />
      <Rail
        data={series}
        renderItem={renderPoster}
        keyExtractor={getSeriesKey}
        height={getPosterCardHeight('lg')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
});
