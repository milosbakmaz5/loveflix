import { useAtomValue } from 'jotai';

import {
  canAfford,
  type Entitlements,
  type Episode,
  getEpisodeCost,
  getMissingCoins,
  isEpisodeUnlocked,
} from '@/domain';

import { entitlementsAtom } from './entitlements.atoms';
import { coinBalanceAtom } from './wallet.atoms';

export type EpisodeAccessState = {
  isUnlocked: boolean;
  /** Coins still needed to watch it: 0 once unlocked. */
  cost: number;
  canAfford: boolean;
  missingCoins: number;
};

export function getEpisodeAccess(
  episode: Episode,
  entitlements: Entitlements,
  balance: number,
): EpisodeAccessState {
  const isUnlocked = isEpisodeUnlocked(episode, entitlements);
  const cost = isUnlocked ? 0 : getEpisodeCost(episode);
  return {
    isUnlocked,
    cost,
    canAfford: canAfford(balance, cost),
    missingCoins: getMissingCoins(balance, cost),
  };
}

/** Lock state of one episode (jotai 3 has no atomFamily, so it derives from the shared atoms). */
export function useEpisodeAccess(episode: Episode): EpisodeAccessState {
  const entitlements = useAtomValue(entitlementsAtom);
  const balance = useAtomValue(coinBalanceAtom);
  return getEpisodeAccess(episode, entitlements, balance);
}
