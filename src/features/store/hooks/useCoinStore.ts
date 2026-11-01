import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { usePurchaseCoinPack } from '@/data';
import {
  buildEpisodeOption,
  type CoinPack,
  type CoinUnlockOption,
  type Episode,
  findPackCovering,
  getMissingCoins,
  type MembershipPlan,
} from '@/domain';
import { useUnlockOptions } from '@/features/unlock/hooks/useUnlockOptions';
import {
  activateMembershipAtom,
  coinBalanceAtom,
  creditCoinsAtom,
  unlockWithCoinsAtom,
} from '@/state';

export type StoreItem =
  { type: 'pack'; pack: CoinPack } | { type: 'membership'; plan: MembershipPlan };

// Back past the store and the unlock card, to the player.
const SCREENS_ABOVE_PLAYER = 2;

type CoinStoreOptions = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  packs: readonly CoinPack[];
  plans: readonly MembershipPlan[];
  optionType: CoinUnlockOption['type'];
};

type CoinStoreState = {
  balance: number;
  /** Coins the option chosen on the unlock card costs. */
  unlockCost: number;
  vipPlan: MembershipPlan | undefined;
  selected: StoreItem | undefined;
  select: (item: StoreItem) => void;
  buy: () => void;
  isBuying: boolean;
  hasPaymentFailed: boolean;
};

export function useCoinStore({
  episode,
  seasonEpisodes,
  packs,
  plans,
  optionType,
}: CoinStoreOptions): CoinStoreState {
  const balance = useAtomValue(coinBalanceAtom);
  const creditCoins = useSetAtom(creditCoinsAtom);
  const unlockWithCoins = useSetAtom(unlockWithCoinsAtom);
  const activateMembership = useSetAtom(activateMembershipAtom);
  const purchase = usePurchaseCoinPack();
  const [chosen, setChosen] = useState<StoreItem | null>(null);

  const options = useUnlockOptions({ episode, seasonEpisodes, plans });
  const option =
    options.find((candidate): candidate is CoinUnlockOption => candidate.type === optionType) ??
    buildEpisodeOption(episode);
  const suggestedPack = findPackCovering(packs, getMissingCoins(balance, option.cost));
  const selected =
    chosen ?? (suggestedPack === undefined ? undefined : { type: 'pack', pack: suggestedPack });

  function finish() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.dismiss(SCREENS_ABOVE_PLAYER);
  }

  function unlockAfterPurchase(coinsGranted: number) {
    creditCoins(coinsGranted);
    const result = unlockWithCoins(option);
    if (!result.ok && result.reason === 'insufficient_coins') {
      // A pack too small for the unlock: stay here, where the new balance shows.
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setChosen(null);
      return;
    }
    finish();
  }

  function buy() {
    switch (selected?.type) {
      case 'pack':
        purchase.mutate(selected.pack.id, {
          onSuccess: (receipt) => unlockAfterPurchase(receipt.coinsGranted),
        });
        return;
      case 'membership':
        activateMembership(selected.plan.id);
        finish();
        return;
      case undefined:
        return;
      default: {
        const _exhaustive: never = selected;
        return _exhaustive;
      }
    }
  }

  return {
    balance,
    unlockCost: option.cost,
    vipPlan: plans.find((plan) => plan.period === 'week'),
    selected,
    select: (item) => {
      purchase.reset();
      setChosen(item);
    },
    buy,
    isBuying: purchase.isPending,
    hasPaymentFailed: purchase.isError,
  };
}
