import { atom } from 'jotai';
import { RESET } from 'jotai/utils';

import {
  activateMembership,
  type CoinUnlockOption,
  type EpisodeId,
  grantEpisodes,
  type MembershipPlanId,
  unlockWithCoins,
  type UnlockResult,
} from '@/domain';

import {
  entitlementsAtom,
  storedMembershipAtom,
  storedUnlockedEpisodeIdsAtom,
  unlockedEpisodeIdsAtom,
} from './entitlements.atoms';
import { storedCoinBalanceAtom } from './wallet.atoms';

/**
 * Pays for an episode or season. Not having enough coins is a normal outcome, not an error:
 * the result says so (with `missingCoins`) and nothing changes.
 */
export const unlockWithCoinsAtom = atom(
  null,
  (get, set, option: CoinUnlockOption): UnlockResult => {
    const result = unlockWithCoins(get(storedCoinBalanceAtom), option, get(entitlementsAtom));
    if (result.ok) {
      set(storedCoinBalanceAtom, result.balance);
      set(storedUnlockedEpisodeIdsAtom, [...result.unlockedEpisodeIds]);
    }
    return result;
  },
);

/** Adds the coins of a completed (mock) App Store purchase. */
export const creditCoinsAtom = atom(null, (_get, set, coins: number): void => {
  if (!Number.isInteger(coins) || coins <= 0) {
    throw new RangeError(`Cannot credit ${coins} coins`);
  }
  set(storedCoinBalanceAtom, (balance) => balance + coins);
});

/** Unlocks one episode for free after the rewarded ad. */
export const unlockWithAdAtom = atom(null, (get, set, episodeId: EpisodeId): void => {
  set(storedUnlockedEpisodeIdsAtom, [...grantEpisodes(get(unlockedEpisodeIdsAtom), [episodeId])]);
});

/** Mock subscription: an active membership unlocks every episode. */
export const activateMembershipAtom = atom(null, (_get, set, planId: MembershipPlanId): void => {
  set(storedMembershipAtom, activateMembership(planId));
});

/** Back to the first-launch state, so the unlock flow can be demoed again. */
export const resetDemoAtom = atom(null, (_get, set): void => {
  set(storedCoinBalanceAtom, RESET);
  set(storedUnlockedEpisodeIdsAtom, RESET);
  set(storedMembershipAtom, RESET);
});
