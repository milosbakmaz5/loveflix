import { useTranslation } from 'react-i18next';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import {
  EmptyState,
  ErrorState,
  Header,
  HeaderBackButton,
  LoadingState,
  Screen,
} from '@/components/ui';
import { useCoinPacks, useEpisodes, useMembershipPlans, useSeries } from '@/data';
import type { EpisodeId, SeriesId } from '@/domain';
import { CoinStore } from '@/features/store/components/CoinStore';
import { parseCoinOptionType } from '@/features/store/utils/parseCoinOptionType';

type StoreScreenProps = {
  seriesId: SeriesId;
  episodeId: EpisodeId;
  /** Which option of the unlock card the coins are for, from the `?option=` route param. */
  optionParam?: string;
};

export function StoreScreen({ seriesId, episodeId, optionParam }: StoreScreenProps) {
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);
  const series = useSeries(seriesId);
  const episodes = useEpisodes(seriesId);
  const packs = useCoinPacks();
  const plans = useMembershipPlans();
  const queries = [series, episodes, packs, plans];
  const error = queries.find((query) => query.error !== null)?.error ?? null;
  const isPending = queries.some((query) => query.isPending);
  const episode = episodes.data?.find(({ id }) => id === episodeId);

  function renderContent() {
    if (error !== null) {
      return (
        <ErrorState
          error={error}
          onRetry={() => queries.forEach((query) => void query.refetch())}
        />
      );
    }
    if (isPending) {
      return <LoadingState />;
    }
    if (
      series.data === undefined ||
      episodes.data === undefined ||
      packs.data === undefined ||
      plans.data === undefined ||
      episode === undefined ||
      packs.data.length === 0
    ) {
      return <EmptyState />;
    }
    return (
      <CoinStore
        series={series.data}
        episode={episode}
        seasonEpisodes={episodes.data}
        packs={packs.data}
        plans={plans.data}
        optionType={parseCoinOptionType(optionParam)}
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
        title={t('store.title')}
        scrollY={scrollY}
      />
      {renderContent()}
    </Screen>
  );
}
