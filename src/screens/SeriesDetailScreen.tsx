import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { ErrorState, Header, HeaderBackButton, LoadingState, Screen } from '@/components/ui';
import { useEpisodes, useHomeFeed, useSeasonBundlePrice, useSeries } from '@/data';
import type { SeriesId } from '@/domain';
import { SeriesDetailList } from '@/features/series/components/SeriesDetailList';
import { SeriesHeaderActions } from '@/features/series/components/SeriesHeaderActions';

type SeriesDetailScreenProps = {
  seriesId: SeriesId;
};

export function SeriesDetailScreen({ seriesId }: SeriesDetailScreenProps) {
  const scrollY = useSharedValue(0);
  const series = useSeries(seriesId);
  const episodes = useEpisodes(seriesId);
  const seasonPrice = useSeasonBundlePrice();
  const homeFeed = useHomeFeed();
  const queries = [series, episodes, seasonPrice, homeFeed];
  const error = queries.find((query) => query.error !== null)?.error ?? null;

  function renderContent() {
    if (error !== null) {
      return (
        <ErrorState
          error={error}
          onRetry={() => queries.forEach((query) => void query.refetch())}
        />
      );
    }
    if (
      series.data === undefined ||
      episodes.data === undefined ||
      seasonPrice.data === undefined ||
      homeFeed.data === undefined
    ) {
      return <LoadingState />;
    }
    return (
      <SeriesDetailList
        series={series.data}
        episodes={episodes.data}
        catalog={homeFeed.data.series}
        seasonPrice={seasonPrice.data}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) =>
          scrollY.set(event.nativeEvent.contentOffset.y)
        }
      />
    );
  }

  return (
    <Screen>
      <Header
        variant="secondary"
        left={<HeaderBackButton />}
        right={<SeriesHeaderActions seriesId={seriesId} />}
        scrollY={scrollY}
      />
      {renderContent()}
    </Screen>
  );
}
