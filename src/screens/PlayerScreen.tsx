import {
  EmptyState,
  ErrorState,
  Header,
  HeaderBackButton,
  LoadingState,
  Screen,
} from '@/components/ui';
import { useEpisodes, useSeries } from '@/data';
import type { SeriesId } from '@/domain';
import { EpisodeFeed } from '@/features/player/components/EpisodeFeed';
import { getInitialEpisodeIndex } from '@/features/player/utils/getInitialEpisodeIndex';

type PlayerScreenProps = {
  seriesId: SeriesId;
  /** Episode number from the `?episode=N` route param. */
  episodeParam?: string;
};

export function PlayerScreen({ seriesId, episodeParam }: PlayerScreenProps) {
  const series = useSeries(seriesId);
  const episodes = useEpisodes(seriesId);
  const error = series.error ?? episodes.error;

  return (
    <Screen>
      <Header variant="secondary" left={<HeaderBackButton />} />
      {(series.isPending || episodes.isPending) && error === null && <LoadingState />}
      {error !== null && (
        <ErrorState
          error={error}
          onRetry={() => {
            void series.refetch();
            void episodes.refetch();
          }}
        />
      )}
      {series.isSuccess && episodes.isSuccess && episodes.data.length === 0 && <EmptyState />}
      {series.isSuccess && episodes.isSuccess && episodes.data.length > 0 && (
        <EpisodeFeed
          seriesTitle={series.data.title}
          episodes={episodes.data}
          initialIndex={getInitialEpisodeIndex(episodes.data, episodeParam)}
        />
      )}
    </Screen>
  );
}
