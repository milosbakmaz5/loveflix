import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { createMockRepositories, RepositoryError } from '@/data';
import type { Repositories } from '@/data';
import { coinBalanceAtom, entitlementsAtom, resetDemoAtom, unlockedEpisodeIdsAtom } from '@/state';
import { createGate } from '@/test/createGate';
import { createTestWrapper } from '@/test/queryTestUtils';

import { StoreScreen } from '../StoreScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), dismiss: jest.fn(), canGoBack: () => true },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

const SERIES_ID = 'billionaires-secret';

async function getEpisodeId(number: number) {
  const repositories = createMockRepositories({ latencyMs: 0 });
  const episodes = await repositories.catalog.getEpisodes(SERIES_ID);
  const episode = episodes.find((candidate) => candidate.number === number);
  if (episode === undefined) {
    throw new Error(`No episode ${number}`);
  }
  return episode.id;
}

type RenderOptions = {
  repositories?: Repositories;
  option?: string;
};

async function renderStore({
  repositories = createMockRepositories({ latencyMs: 0 }),
  option = 'episode',
}: RenderOptions = {}) {
  const store = createStore();
  const QueryWrapper = createTestWrapper({ repositories });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryWrapper>{children}</QueryWrapper>
      </Provider>
    );
  }
  const episodeId = await getEpisodeId(5);
  await render(<StoreScreen seriesId={SERIES_ID} episodeId={episodeId} optionParam={option} />, {
    wrapper: Wrapper,
  });
  return { store, episodeId };
}

beforeEach(() => {
  jest.clearAllMocks();
  // Saved state lives in storage, which outlives each test's store.
  createStore().set(resetDemoAtom);
});

describe('StoreScreen', () => {
  it('shows the episode, its cost and the balance', async () => {
    await renderStore();

    expect(await screen.findByText('Episode 5 • Locked')).toBeOnTheScreen();
    expect(screen.getByText('Unlock for 20 Coins')).toBeOnTheScreen();
    expect(screen.getByText('15 Coins')).toBeOnTheScreen();
  });

  it('preselects the cheapest pack that covers the single episode', async () => {
    await renderStore();

    expect(await screen.findByRole('button', { name: 'Buy 300 Coins, for €2.99' })).toBeTruthy();
  });

  it('preselects a bigger pack for the season', async () => {
    await renderStore({ option: 'season' });

    expect(await screen.findByRole('button', { name: 'Buy 800 Coins, for €6.99' })).toBeTruthy();
  });

  it('buys the pack, unlocks the episode and returns to the player', async () => {
    const { store, episodeId } = await renderStore();

    await fireEvent.press(await screen.findByRole('button', { name: /^Buy 300 Coins/ }));

    await waitFor(() => expect(router.dismiss).toHaveBeenCalledWith(2));
    expect(store.get(unlockedEpisodeIdsAtom)).toEqual(new Set([episodeId]));
    // 15 + 300 - 20
    expect(store.get(coinBalanceAtom)).toBe(295);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('stays on the store when the chosen pack does not cover the unlock', async () => {
    const { store } = await renderStore({ option: 'season' });
    await fireEvent.press(await screen.findByRole('radio', { name: /^300 Coins/ }));

    await fireEvent.press(screen.getByRole('button', { name: /^Buy 300 Coins/ }));

    expect(await screen.findByText('315 Coins')).toBeOnTheScreen();
    expect(router.dismiss).not.toHaveBeenCalled();
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
    // The suggestion now covers what is still missing.
    expect(screen.getByRole('button', { name: /^Buy 300 Coins/ })).toBeTruthy();
  });

  it('activates VIP without spending coins and returns to the player', async () => {
    const { store } = await renderStore();
    await fireEvent.press(await screen.findByRole('radio', { name: /VIP Membership/ }));

    await fireEvent.press(screen.getByRole('button', { name: 'Start VIP, for €4.99/week' }));

    expect(store.get(entitlementsAtom).membership.status).toBe('active');
    expect(store.get(coinBalanceAtom)).toBe(15);
    expect(router.dismiss).toHaveBeenCalledWith(2);
  });

  it('shows a message when the payment fails, keeps the coins and lets you retry', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const purchase = repositories.store.purchaseCoinPack;
    jest
      .spyOn(repositories.store, 'purchaseCoinPack')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(purchase);
    const { store } = await renderStore({ repositories });
    const buy = await screen.findByRole('button', { name: /^Buy 300 Coins/ });

    await fireEvent.press(buy);

    expect(await screen.findByRole('alert')).toBeOnTheScreen();
    expect(store.get(coinBalanceAtom)).toBe(15);
    expect(router.dismiss).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: /^Buy 300 Coins/ }));
    await waitFor(() => expect(router.dismiss).toHaveBeenCalledWith(2));
  });

  it('clears the failure message when another item is selected', async () => {
    const repositories = createMockRepositories({
      latencyMs: 0,
      shouldFail: (op) => op === 'purchaseCoinPack',
    });
    await renderStore({ repositories });

    await fireEvent.press(await screen.findByRole('button', { name: /^Buy 300 Coins/ }));
    await screen.findByRole('alert');
    await fireEvent.press(screen.getByRole('radio', { name: /^800 Coins/ }));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeOnTheScreen());
  });

  it('shows an error with Retry, and Retry loads the store', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getPacks = repositories.store.getCoinPacks;
    jest
      .spyOn(repositories.store, 'getCoinPacks')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(getPacks);
    await renderStore({ repositories });

    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Your Balance')).toBeOnTheScreen();
  });

  it('shows the loading state first and keeps the back button', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getCoinPacks = repositories.store.getCoinPacks;
    const gate = createGate();
    jest
      .spyOn(repositories.store, 'getCoinPacks')
      .mockImplementation(() => gate.opened.then(() => getCoinPacks()));
    await renderStore({ repositories });

    expect(screen.getByLabelText('Loading…')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    gate.open();
    await act(async () => {
      await screen.findByText('Your Balance');
    });
  });

  it('shows the empty state when there are no packs', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    jest.spyOn(repositories.store, 'getCoinPacks').mockResolvedValue([]);
    await renderStore({ repositories });

    expect(await screen.findByText('Nothing here yet.')).toBeOnTheScreen();
  });
});
