import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getPosterCardHeight, PosterCard, Rail, SectionHeader } from '@/components/ui';
import type { Series } from '@/domain';
import { spacing } from '@/theme';

import { RAIL_ROW_HEIGHT } from '../utils/homeRows';

type SeriesRailProps = {
  title: string;
  series: readonly Series[];
};

function openSeries(series: Series) {
  router.push({ pathname: '/series/[id]', params: { id: series.id } });
}

function renderPoster({ item }: { item: Series }) {
  return <PosterCard series={item} onPress={openSeries} />;
}

function getSeriesKey(series: Series) {
  return series.id;
}

export function SeriesRail({ title, series }: SeriesRailProps) {
  return (
    <View style={styles.row}>
      <SectionHeader title={title} variant="h3" />
      <Rail
        data={series}
        renderItem={renderPoster}
        keyExtractor={getSeriesKey}
        height={getPosterCardHeight('md')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: RAIL_ROW_HEIGHT,
    gap: spacing.sm,
  },
});
