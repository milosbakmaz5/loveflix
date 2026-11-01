import { StyleSheet, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/ui';
import { useEpisodes, useMembershipPlans } from '@/data';
import type { EpisodeId, SeriesId } from '@/domain';
import { UnlockCard } from '@/features/unlock/components/UnlockCard';
import { UnlockContent } from '@/features/unlock/components/UnlockContent';

type UnlockScreenProps = {
  episodeId: EpisodeId;
  seriesId: SeriesId;
};

export function UnlockScreen({ episodeId, seriesId }: UnlockScreenProps) {
  const episodes = useEpisodes(seriesId);
  const plans = useMembershipPlans();
  const error = episodes.error ?? plans.error;
  const episode = episodes.data?.find(({ id }) => id === episodeId);

  return (
    <UnlockCard>
      {episodes.isSuccess && plans.isSuccess && episode !== undefined ? (
        <UnlockContent episode={episode} seasonEpisodes={episodes.data} plans={plans.data} />
      ) : (
        <View style={styles.state}>
          {error !== null && (
            <ErrorState
              error={error}
              onRetry={() => {
                void episodes.refetch();
                void plans.refetch();
              }}
            />
          )}
          {error === null && (episodes.isPending || plans.isPending) && <LoadingState />}
          {error === null && episodes.isSuccess && plans.isSuccess && <EmptyState />}
        </View>
      )}
    </UnlockCard>
  );
}

const styles = StyleSheet.create({
  // About the height of the loaded content, so the card doesn't jump when it arrives.
  state: {
    height: 686,
  },
});
