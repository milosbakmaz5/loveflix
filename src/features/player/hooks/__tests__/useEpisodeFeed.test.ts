import type { FlashListRef, ViewToken } from '@shopify/flash-list';
import { act, renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { createStore, Provider } from 'jotai';
import { createElement, type ReactNode, type RefObject } from 'react';

import type { Episode } from '@/domain';
import { makeEpisode } from '@/domain/__tests__/fixtures';
import { resetDemoAtom, unlockWithAdAtom } from '@/state';

import { useEpisodeFeed } from '../useEpisodeFeed';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Warning: 'warning' },
}));

// Episode 4 is the last free one, so moving on from it lands on a locked episode.
const episodes = [makeEpisode(3), makeEpisode(4), makeEpisode(5)];

function viewable(episode: Episode): { viewableItems: ViewToken<Episode>[] } {
  return {
    viewableItems: [{ item: episode, key: episode.id, index: 0, isViewable: true, timestamp: 0 }],
  };
}

async function renderFeed(initialIndex = 0) {
  const scrollToIndex = jest.fn().mockResolvedValue(undefined);
  // Only the method the hook calls: the real ref needs a mounted list.
  const listRef = { current: { scrollToIndex } } as unknown as RefObject<FlashListRef<Episode>>;
  const { result } = await renderHook(() => useEpisodeFeed({ episodes, initialIndex, listRef }));
  return { result, scrollToIndex };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useEpisodeFeed', () => {
  it('starts on the initial episode, not playing', async () => {
    const { result } = await renderFeed(1);

    expect(result.current.activeEpisodeId).toBe('s1-e4');
    expect(result.current.isWatchMode).toBe(false);
  });

  it('follows the visible episode and ignores an empty update', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(5))));
    await act(async () => result.current.onViewableItemsChanged({ viewableItems: [] }));

    expect(result.current.activeEpisodeId).toBe('s1-e5');
  });

  it('keeps playing across slides once started', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.play());
    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(4))));

    expect(result.current.isWatchMode).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('turns watch mode off for the whole feed when paused', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.play());
    await act(async () => result.current.togglePause());
    expect(result.current.isWatchMode).toBe(false);
    expect(result.current.isPaused).toBe(true);

    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(4))));
    expect(result.current.isWatchMode).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('does not bring the paused state back when returning to that episode', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.play());
    await act(async () => result.current.togglePause());
    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(4))));
    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(3))));

    expect(result.current.isPaused).toBe(false);
  });

  it('keeps the pause when the same episode is reported visible again', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.play());
    await act(async () => result.current.togglePause());
    await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(3))));

    expect(result.current.isPaused).toBe(true);
  });

  it('resumes watch mode from a second toggle', async () => {
    const { result } = await renderFeed();

    await act(async () => result.current.play());
    await act(async () => result.current.togglePause());
    await act(async () => result.current.togglePause());

    expect(result.current.isWatchMode).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('moves to the next free episode without a warning', async () => {
    const { result, scrollToIndex } = await renderFeed();

    await act(async () => result.current.finishEpisode());

    expect(scrollToIndex).toHaveBeenCalledWith({ index: 1, animated: true });
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  it('warns when the next episode is locked (the cliffhanger)', async () => {
    const { result, scrollToIndex } = await renderFeed(1);

    await act(async () => result.current.finishEpisode());

    expect(scrollToIndex).toHaveBeenCalledWith({ index: 2, animated: true });
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
  });

  it('stops on the last episode', async () => {
    const { result, scrollToIndex } = await renderFeed(2);

    await act(async () => result.current.play());
    await act(async () => result.current.finishEpisode());

    expect(scrollToIndex).not.toHaveBeenCalled();
    expect(result.current.isWatchMode).toBe(false);
  });

  describe('unlocking', () => {
    // Saved state lives in storage, which outlives each test's store.
    beforeEach(() => {
      createStore().set(resetDemoAtom);
    });

    async function renderWithStore() {
      const store = createStore();
      const scrollToIndex = jest.fn().mockResolvedValue(undefined);
      const listRef = { current: { scrollToIndex } } as unknown as RefObject<FlashListRef<Episode>>;
      const { result } = await renderHook(
        () => useEpisodeFeed({ episodes, initialIndex: 2, listRef }),
        {
          wrapper: ({ children }: { children: ReactNode }) =>
            createElement(Provider, { store }, children),
        },
      );
      return { result, store };
    }

    it('starts playing when the episode on screen gets unlocked', async () => {
      const { result, store } = await renderWithStore();
      expect(result.current.isWatchMode).toBe(false);

      await act(async () => store.set(unlockWithAdAtom, 's1-e5'));

      expect(result.current.isWatchMode).toBe(true);
      expect(result.current.isPaused).toBe(false);
    });

    it('does not start when another episode gets unlocked', async () => {
      const { result, store } = await renderWithStore();

      await act(async () => store.set(unlockWithAdAtom, 's1-e9'));

      expect(result.current.isWatchMode).toBe(false);
    });

    it('does not start when moving onto an episode that is already unlocked', async () => {
      const { result } = await renderWithStore();

      await act(async () => result.current.onViewableItemsChanged(viewable(makeEpisode(4))));

      expect(result.current.isWatchMode).toBe(false);
    });
  });
});
