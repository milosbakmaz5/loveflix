import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import type { Episode, MembershipPlan, UnlockOption, UnlockOptionType } from '@/domain';
import { activateMembershipAtom, unlockWithCoinsAtom } from '@/state';

import { useUnlockOptions } from './useUnlockOptions';

const DEFAULT_OPTION: UnlockOptionType = 'season';

type UnlockFlowOptions = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  plans: readonly MembershipPlan[];
};

type UnlockFlow = {
  options: UnlockOption[];
  selectedType: UnlockOptionType | undefined;
  select: (type: UnlockOptionType) => void;
  /** Unlocks with the selected option, or opens the store when coins are short. */
  confirm: () => void;
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

  function unlockWith(option: UnlockOption) {
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
      case 'ad':
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
    dismiss: () => router.back(),
  };
}
