import * as Haptics from 'expo-haptics';
import { useAtomValue, useSetAtom } from 'jotai';

import { DEMO_CONFIG } from '@/config/demo';
import { usePurchaseSeason } from '@/data';
import { buildSeasonOption, type Episode } from '@/domain';
import { entitlementsAtom, grantEpisodesAtom } from '@/state';

type SeasonPurchase = {
  /** False once at most one episode is left to unlock: a bundle makes no sense then. */
  isAvailable: boolean;
  buy: () => void;
  isBuying: boolean;
  hasFailed: boolean;
};

/** The season bundle at its own money price, separate from paying with coins on the unlock card. */
export function useSeasonPurchase(episodes: readonly Episode[]): SeasonPurchase {
  const entitlements = useAtomValue(entitlementsAtom);
  const grantEpisodes = useSetAtom(grantEpisodesAtom);
  const purchase = usePurchaseSeason();
  const lockedSeason = buildSeasonOption(episodes, 1, entitlements, DEMO_CONFIG.seasonDiscountRate);

  return {
    isAvailable: lockedSeason !== undefined && lockedSeason.episodeIds.length > 1,
    buy: () => {
      if (lockedSeason === undefined) {
        return;
      }
      purchase.mutate(lockedSeason.seriesId, {
        onSuccess: () => {
          grantEpisodes(lockedSeason.episodeIds);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      });
    },
    isBuying: purchase.isPending,
    hasFailed: purchase.isError,
  };
}
