import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { type NativeScrollEvent, type NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { SectionHeader, Tag, useListBottomPadding } from '@/components/ui';
import type { Episode, Money, Series } from '@/domain';
import { borderColors, spacing } from '@/theme';

import { useSeriesEpisodes } from '../hooks/useSeriesEpisodes';
import { getRelatedSeries } from '../utils/getRelatedSeries';
import { CastRail } from './CastRail';
import { EpisodeRow } from './EpisodeRow';
import { RelatedSeriesRail } from './RelatedSeriesRail';
import { SeriesActions } from './SeriesActions';
import { SeriesHero } from './SeriesHero';
import { SeriesSynopsis } from './SeriesSynopsis';
import { ShowMoreEpisodes } from './ShowMoreEpisodes';
import { UnlockSeasonBanner } from './UnlockSeasonBanner';
import { WhyYoullLoveIt } from './WhyYoullLoveIt';

type SeriesDetailListProps = {
  series: Series;
  episodes: readonly Episode[];
  /** Every known series, to pick the recommendations from. */
  catalog: readonly Series[];
  seasonPrice: Money;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

function renderEpisode({ item }: { item: Episode }) {
  return <EpisodeRow episode={item} />;
}

function getEpisodeKey(episode: Episode) {
  return episode.id;
}

/** The screen's one vertical scroll. The rows are the episodes; the rest is header and footer. */
export function SeriesDetailList({
  series,
  episodes,
  catalog,
  seasonPrice,
  onScroll,
}: SeriesDetailListProps) {
  const { t } = useTranslation();
  const bottomPadding = useListBottomPadding({ hasTabBar: true });
  const { visibleEpisodes, hasMore, showMore, toggleOrder } = useSeriesEpisodes(episodes);
  const related = getRelatedSeries(series, catalog);

  return (
    <FlashList
      data={visibleEpisodes}
      renderItem={renderEpisode}
      keyExtractor={getEpisodeKey}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      // Sorting replaces the rows; there is no position to keep.
      maintainVisibleContentPosition={{ disabled: true }}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      ListHeaderComponent={
        <View style={styles.header}>
          <SeriesHero series={series} />
          <SeriesActions seriesId={series.id} />
          <SeriesSynopsis synopsis={series.synopsis} />
          {series.highlights.length > 0 && <WhyYoullLoveIt highlights={series.highlights} />}
          <View style={styles.separator} />
          {series.cast.length > 0 && (
            <>
              <CastRail cast={series.cast} />
              <View style={styles.separator} />
            </>
          )}
          <SectionHeader
            title={t('series.episodesHeading')}
            accessory={<Tag label={String(episodes.length)} />}
            actionLabel={t('series.sort')}
            onAction={toggleOrder}
          />
          <UnlockSeasonBanner episodes={episodes} price={seasonPrice} />
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {hasMore && <ShowMoreEpisodes onPress={showMore} />}
          {related.length > 0 && <RelatedSeriesRail series={related} />}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.lg,
    marginBottom: spacing.xs,
  },
  separator: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: borderColors.default,
  },
  footer: {
    gap: spacing.xl,
    marginTop: spacing.xs,
  },
});
