import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { createMockRepositories, RepositoryError } from '@/data';
import {
  coinBalanceAtom,
  creditCoinsAtom,
  entitlementsAtom,
  resetDemoAtom,
  unlockedEpisodeIdsAtom,
} from '@/state';
import { createGate } from '@/test/createGate';
import { createTestWrapper } from '@/test/queryTestUtils';

import { UnlockScreen } from '../UnlockScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

const SERIES_ID = 'billionaires-secret';
// Episode ids aren't parsed anywhere: read the real one from the repository.
async function getEpisodeId(number: number) {
  const repositories = createMockRepositories({ latencyMs: 0 });
  const episodes = await repositories.catalog.getEpisodes(SERIES_ID);
  const episode = episodes.find((candidate) => candidate.number === number);
  if (episode === undefined) {
    throw new Error(`No episode ${number}`);
  }
  return episode.id;
}

async function renderUnlock({
  repositories = createMockRepositories({ latencyMs: 0 }),
  coins = 0,
  episodeNumber = 5,
} = {}) {
  const store = createStore();
  if (coins > 0) {
    store.set(creditCoinsAtom, coins);
  }
  const QueryWrapper = createTestWrapper({ repositories });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryWrapper>{children}</QueryWrapper>
      </Provider>
    );
  }
  const episodeId = await getEpisodeId(episodeNumber);
  await render(<UnlockScreen episodeId={episodeId} seriesId={SERIES_ID} />, { wrapper: Wrapper });
  return { store, episodeId };
}

async function pressConfirm() {
  await fireEvent.press(await screen.findByRole('button', { name: 'Unlock Now' }));
}

beforeEach(() => {
  jest.clearAllMocks();
  // Saved state lives in storage, which outlives each test's store.
  createStore().set(resetDemoAtom);
});

describe('UnlockScreen', () => {
  it('shows the episode and three options with the season preselected', async () => {
    await renderUnlock();

    expect(await screen.findByRole('header', { name: 'Continue the romance' })).toBeOnTheScreen();
    expect(screen.getByText('Episode 5')).toBeOnTheScreen();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { selected: true, name: /Unlock Full Season/ })).toBeTruthy();
  });

  it('opens the store and spends nothing when coins are short', async () => {
    const { store, episodeId } = await renderUnlock();
    const balance = store.get(coinBalanceAtom);

    await pressConfirm();

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/store',
      params: { seriesId: SERIES_ID, episodeId, option: 'season' },
    });
    expect(router.back).not.toHaveBeenCalled();
    expect(store.get(coinBalanceAtom)).toBe(balance);
  });

  it('keeps the selection after coming back from the store', async () => {
    await renderUnlock();
    await fireEvent.press(await screen.findByRole('radio', { name: /Unlock Episode/ }));

    await pressConfirm();

    expect(screen.getByRole('radio', { selected: true, name: /Unlock Episode/ })).toBeTruthy();
  });

  it('unlocks the selected episode with coins, then closes with a success haptic', async () => {
    const { store, episodeId } = await renderUnlock({ coins: 100 });
    const balance = store.get(coinBalanceAtom);
    await fireEvent.press(await screen.findByRole('radio', { name: /Unlock Episode/ }));

    await pressConfirm();

    expect(store.get(unlockedEpisodeIdsAtom)).toEqual(new Set([episodeId]));
    expect(store.get(coinBalanceAtom)).toBe(balance - 20);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('unlocks the rest of the season with coins', async () => {
    const { store } = await renderUnlock({ coins: 1000 });

    await pressConfirm();

    expect(store.get(unlockedEpisodeIdsAtom).size).toBeGreaterThan(1);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('activates the membership without spending coins', async () => {
    const { store } = await renderUnlock();
    const balance = store.get(coinBalanceAtom);
    await fireEvent.press(await screen.findByRole('radio', { name: /Premium Membership/ }));

    await pressConfirm();

    expect(store.get(entitlementsAtom).membership.status).toBe('active');
    expect(store.get(coinBalanceAtom)).toBe(balance);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('opens the ad from the link, without unlocking yet', async () => {
    const { store, episodeId } = await renderUnlock();

    await fireEvent.press(await screen.findByRole('button', { name: /Watch an ad/ }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/ad/[episodeId]',
      params: { episodeId },
    });
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
  });

  it('closes without unlocking on Maybe Later and on the backdrop', async () => {
    const { store } = await renderUnlock({ coins: 1000 });

    await fireEvent.press(await screen.findByRole('button', { name: 'Maybe Later' }));
    // Screen readers stay inside the card, where Maybe Later closes it; the backdrop is for touch.
    await fireEvent.press(screen.getByLabelText('Close', { includeHiddenElements: true }));

    expect(router.back).toHaveBeenCalledTimes(2);
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
  });

  it('shows the loading state first', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getPlans = repositories.store.getMembershipPlans;
    const gate = createGate();
    jest
      .spyOn(repositories.store, 'getMembershipPlans')
      .mockImplementation(() => gate.opened.then(() => getPlans()));
    await renderUnlock({ repositories });

    expect(screen.getByLabelText('Loading…')).toBeOnTheScreen();
    gate.open();
    expect(await screen.findByText('Episode 5')).toBeOnTheScreen();
  });

  it('shows an error with Retry, and Retry loads the options', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getPlans = repositories.store.getMembershipPlans;
    jest
      .spyOn(repositories.store, 'getMembershipPlans')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(getPlans);
    await renderUnlock({ repositories });

    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Unlock Now')).toBeOnTheScreen();
  });

  it('shows the empty state when the episode no longer exists', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    jest.spyOn(repositories.catalog, 'getEpisodes').mockResolvedValue([]);
    await render(<UnlockScreen episodeId="missing" seriesId={SERIES_ID} />, {
      wrapper: createTestWrapper({ repositories }),
    });

    expect(await screen.findByText('Nothing here yet.')).toBeOnTheScreen();
  });
});
