import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import type { Episode, MembershipPlan } from '@/domain';
import { activateMembershipAtom, unlockWithCoinsAtom } from '@/state';

import type { SheetOption } from '../utils/getSheetOptions';
import { useUnlockOptions } from './useUnlockOptions';

const DEFAULT_OPTION: SheetOption['type'] = 'season';

type UnlockFlowOptions = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  plans: readonly MembershipPlan[];
};

type UnlockFlow = {
  options: SheetOption[];
  selectedType: SheetOption['type'] | undefined;
  select: (type: SheetOption['type']) => void;
  /** Unlocks with the selected option, or opens the store when coins are short. */
  confirm: () => void;
  watchAd: () => void;
  dismiss: () => void;
};

export function useUnlockFlow({ episode, seasonEpisodes, plans }: UnlockFlowOptions): UnlockFlow {
  const unlockWithCoins = useSetAtom(unlockWithCoinsAtom);
  const activateMembership = useSetAtom(activateMembershipAtom);
  const [preferredType, setPreferredType] = useState(DEFAULT_OPTION);

  const options = useUnlockOptions({ episode, seasonEpisodes, plans });
  const selected = options.find(({ type }) => type === preferredType) ?? options[0];

  function finish() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function unlockWith(option: SheetOption) {
    switch (option.type) {
      case 'episode':
      case 'season': {
        const result = unlockWithCoins(option);
        if (result.ok) {
          finish();
        } else if (result.reason === 'insufficient_coins') {
          router.push({
            pathname: '/store',
            params: { seriesId: episode.seriesId, episodeId: episode.id, option: option.type },
          });
        } else {
          router.back();
        }
        return;
      }
      case 'membership':
        activateMembership(option.plan.id);
        finish();
        return;
      default: {
        const _exhaustive: never = option;
        return _exhaustive;
      }
    }
  }

  return {
    options,
    selectedType: selected?.type,
    select: setPreferredType,
    confirm: () => {
      if (selected !== undefined) {
        unlockWith(selected);
      }
    },
    watchAd: () => router.push({ pathname: '/ad/[episodeId]', params: { episodeId: episode.id } }),
    dismiss: () => router.back(),
  };
}
