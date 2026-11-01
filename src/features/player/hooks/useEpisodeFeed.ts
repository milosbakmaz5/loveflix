import type { FlashListRef, ViewToken } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useAtomValue } from 'jotai';
import { type RefObject, useCallback, useState } from 'react';

import { type Episode, type EpisodeId, isEpisodeUnlocked } from '@/domain';
import { entitlementsAtom } from '@/state';

// More than half: exactly one full-height page can be viewable at a time.
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };

type EpisodeFeedState = {
  viewabilityConfig: typeof VIEWABILITY_CONFIG;
  onViewableItemsChanged: (info: { viewableItems: ViewToken<Episode>[] }) => void;
  activeEpisodeId: EpisodeId | undefined;
  /** Belongs to the feed, not an episode: on, every slide plays when it becomes active. */
  isWatchMode: boolean;
  /** Watch mode was turned off on the active episode, which keeps showing its video frame. */
  isPaused: boolean;
  play: () => void;
  togglePause: () => void;
  /** The active episode reached its end: move on to the next one. */
  finishEpisode: () => void;
};

type EpisodeFeedOptions = {
  episodes: readonly Episode[];
  initialIndex: number;
  /** Start in watch mode instead of on the thumbnail and Watch button. */
  autoplay?: boolean;
  listRef: RefObject<FlashListRef<Episode> | null>;
};

export function useEpisodeFeed({
  episodes,
  initialIndex,
  autoplay = false,
  listRef,
}: EpisodeFeedOptions): EpisodeFeedState {
  const entitlements = useAtomValue(entitlementsAtom);
  const [activeEpisodeId, setActiveEpisodeId] = useState(episodes[initialIndex]?.id);
  const [isWatchMode, setIsWatchMode] = useState(autoplay);
  // Only the episode that was paused keeps its frame; leaving it brings back the thumbnail.
  const [pausedEpisodeId, setPausedEpisodeId] = useState<EpisodeId | null>(null);

  // Unlocking the episode on screen means the viewer paid to watch it, so it starts right away.
  const isActiveUnlocked = episodes.some(
    (episode) => episode.id === activeEpisodeId && isEpisodeUnlocked(episode, entitlements),
  );
  const [seenActive, setSeenActive] = useState({ id: activeEpisodeId, isActiveUnlocked });
  if (seenActive.id !== activeEpisodeId || seenActive.isActiveUnlocked !== isActiveUnlocked) {
    if (seenActive.id === activeEpisodeId && isActiveUnlocked) {
      setIsWatchMode(true);
      setPausedEpisodeId(null);
    }
    setSeenActive({ id: activeEpisodeId, isActiveUnlocked });
  }

  // useCallback: the list requires a stable viewability callback.
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Episode>[] }) => {
      const visible = viewableItems[0];
      if (visible !== undefined) {
        setActiveEpisodeId(visible.item.id);
        setPausedEpisodeId((paused) => (paused === visible.item.id ? paused : null));
      }
    },
    [],
  );

  function play() {
    setIsWatchMode(true);
    setPausedEpisodeId(null);
  }

  function togglePause() {
    if (isWatchMode) {
      setIsWatchMode(false);
      setPausedEpisodeId(activeEpisodeId ?? null);
    } else {
      play();
    }
  }

  function finishEpisode() {
    const nextIndex = episodes.findIndex((episode) => episode.id === activeEpisodeId) + 1;
    const next = episodes[nextIndex];
    if (next === undefined) {
      setIsWatchMode(false);
      setPausedEpisodeId(null);
      return;
    }
    if (!isEpisodeUnlocked(next, entitlements)) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    void listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }

  return {
    viewabilityConfig: VIEWABILITY_CONFIG,
    onViewableItemsChanged,
    activeEpisodeId,
    isWatchMode,
    isPaused: pausedEpisodeId !== null && pausedEpisodeId === activeEpisodeId,
    play,
    togglePause,
    finishEpisode,
  };
}
