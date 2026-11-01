import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { DEMO_CONFIG } from '@/config/demo';
import { resetDemoAtom, unlockedEpisodeIdsAtom } from '@/state';

import { AdScreen } from '../AdScreen';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), dismiss: jest.fn() },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

const EPISODE_ID = 's1-e5';

async function renderAd() {
  const store = createStore();
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  await render(<AdScreen episodeId={EPISODE_ID} />, { wrapper: Wrapper });
  return store;
}

async function advance(seconds: number) {
  await act(async () => {
    jest.advanceTimersByTime(seconds * 1000);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  // Saved state lives in storage, which outlives each test's store.
  createStore().set(resetDemoAtom);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AdScreen', () => {
  it('counts down from the configured duration', async () => {
    await renderAd();

    expect(screen.getByText(`Unlocks in ${DEMO_CONFIG.adDurationSec} seconds`)).toBeOnTheScreen();

    await advance(DEMO_CONFIG.adDurationSec - 1);

    expect(screen.getByText('Unlocks in 1 second')).toBeOnTheScreen();
  });

  it('does not unlock before the countdown ends', async () => {
    const store = await renderAd();

    await advance(DEMO_CONFIG.adDurationSec - 1);

    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
    expect(router.dismiss).not.toHaveBeenCalled();
  });

  it('unlocks the episode at the end and returns to the player', async () => {
    const store = await renderAd();

    await advance(DEMO_CONFIG.adDurationSec);

    expect(store.get(unlockedEpisodeIdsAtom)).toEqual(new Set([EPISODE_ID]));
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    expect(router.dismiss).toHaveBeenCalledTimes(1);
    expect(router.dismiss).toHaveBeenCalledWith(2);
  });

  it('closing early goes back and unlocks nothing', async () => {
    const store = await renderAd();

    await advance(1);
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
  });
});
