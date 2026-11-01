import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { DEMO_CONFIG } from '@/config/demo';
import type { EpisodeId } from '@/domain';
import { unlockWithAdAtom } from '@/state';

// Back past the ad and the unlock card, to the player.
const SCREENS_ABOVE_PLAYER = 2;
const TICK_MS = 1000;

type RewardedAdOptions = {
  episodeId: EpisodeId;
};

type RewardedAd = {
  secondsLeft: number;
  /** Leaves the ad early: back to the unlock card, with nothing unlocked. */
  close: () => void;
};

export function useRewardedAd({ episodeId }: RewardedAdOptions): RewardedAd {
  const unlockWithAd = useSetAtom(unlockWithAdAtom);
  const [secondsLeft, setSecondsLeft] = useState<number>(DEMO_CONFIG.adDurationSec);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      unlockWithAd(episodeId);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismiss(SCREENS_ABOVE_PLAYER);
    }
  }, [secondsLeft, episodeId, unlockWithAd]);

  return { secondsLeft, close: () => router.back() };
}
