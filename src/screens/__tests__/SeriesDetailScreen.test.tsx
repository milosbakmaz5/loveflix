import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { createMockRepositories, RepositoryError } from '@/data';
import type { Repositories } from '@/data';
import { activateMembershipAtom, resetDemoAtom, unlockedEpisodeIdsAtom } from '@/state';
import { createTestWrapper } from '@/test/queryTestUtils';

import { SeriesDetailScreen } from '../SeriesDetailScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), canGoBack: () => true },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

const SERIES_ID = 'billionaires-secret';
const LOCKED_LABEL = /^5\. .*Locked$/;

async function renderSeries({
  repositories = createMockRepositories({ latencyMs: 0 }),
  store = createStore(),
  seriesId = SERIES_ID,
}: {
  repositories?: Repositories;
  store?: ReturnType<typeof createStore>;
  seriesId?: string;
} = {}) {
  const QueryWrapper = createTestWrapper({ repositories });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryWrapper>{children}</QueryWrapper>
      </Provider>
    );
  }
  await render(<SeriesDetailScreen seriesId={seriesId} />, { wrapper: Wrapper });
  await screen.findByRole('button', { name: 'Play Ep 1' });
  return store;
}

beforeEach(() => {
  jest.clearAllMocks();
  // Saved state lives in storage, which outlives each test's store.
  createStore().set(resetDemoAtom);
});

describe('SeriesDetailScreen', () => {
  it('shows the series, synopsis, highlights and cast', async () => {
    await renderSeries();

    expect(screen.getByRole('header', { name: "The Billionaire's Secret" })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Synopsis' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: "Why you'll love it" })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Cast & Crew' })).toBeOnTheScreen();
    expect(screen.getByText('Alexander Sterling')).toBeOnTheScreen();
  });

  it('hides the cast and highlights when a series has none', async () => {
    await renderSeries({ seriesId: 'avenging-angel' });

    expect(screen.queryByRole('header', { name: 'Cast & Crew' })).not.toBeOnTheScreen();
    expect(screen.queryByRole('header', { name: "Why you'll love it" })).not.toBeOnTheScreen();
  });

  it('plays episode 1 right away from Play', async () => {
    await renderSeries();

    await fireEvent.press(screen.getByRole('button', { name: 'Play Ep 1' }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/watch/[seriesId]',
      params: { seriesId: SERIES_ID, episode: '1', autoplay: 'true' },
    });
  });

  it('plays an unlocked row right away', async () => {
    await renderSeries();

    await fireEvent.press(screen.getByRole('button', { name: /^2\. / }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/watch/[seriesId]',
      params: { seriesId: SERIES_ID, episode: '2', autoplay: 'true' },
    });
  });

  it('opens a locked row on the player, without autoplay', async () => {
    await renderSeries();

    await fireEvent.press(screen.getByRole('button', { name: LOCKED_LABEL }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/watch/[seriesId]',
      params: { seriesId: SERIES_ID, episode: '5' },
    });
  });

  it('shows six episodes until Show more, which then disappears', async () => {
    await renderSeries();

    expect(screen.queryByRole('button', { name: /^7\. / })).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show more episodes' }));

    expect(await screen.findByRole('button', { name: /^7\. / })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Show more episodes' })).not.toBeOnTheScreen();
  });

  it('sorts from the last episode', async () => {
    await renderSeries();

    await fireEvent.press(screen.getByRole('button', { name: 'Sort, Episodes' }));

    expect(await screen.findByRole('button', { name: /^45\. / })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^1\. / })).not.toBeOnTheScreen();
  });

  it('toggles My List on both hearts together', async () => {
    await renderSeries();
    const hearts = screen.getAllByRole('button', { name: 'Add to My List' });
    expect(hearts).toHaveLength(2);

    await fireEvent.press(hearts[0]!);

    expect(screen.getAllByRole('button', { name: 'Remove from My List' })).toHaveLength(2);

    await fireEvent.press(screen.getAllByRole('button', { name: 'Remove from My List' })[1]!);

    expect(screen.getAllByRole('button', { name: 'Add to My List' })).toHaveLength(2);
  });

  it('opens a related series', async () => {
    await renderSeries();

    await fireEvent.press(screen.getAllByRole('button', { name: /episodes/ }).at(-1)!);

    expect(router.push).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/series/[id]' }));
  });

  describe('season banner', () => {
    const BUY = 'Unlock Full Season for €9.99';

    it('buys every locked episode at the money price, and then goes away', async () => {
      const store = await renderSeries();

      await fireEvent.press(screen.getByRole('button', { name: BUY }));

      await waitFor(() => expect(store.get(unlockedEpisodeIdsAtom).size).toBe(41));
      expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: BUY })).not.toBeOnTheScreen(),
      );
      expect(screen.queryByRole('button', { name: LOCKED_LABEL })).not.toBeOnTheScreen();
    });

    it('shows a message and unlocks nothing when the payment fails', async () => {
      const repositories = createMockRepositories({
        latencyMs: 0,
        shouldFail: (operation) => operation === 'purchaseSeason',
      });
      const store = await renderSeries({ repositories });

      await fireEvent.press(screen.getByRole('button', { name: BUY }));

      expect(await screen.findByRole('alert')).toBeOnTheScreen();
      expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
    });

    it('is hidden when nothing is left to unlock', async () => {
      const store = createStore();
      store.set(activateMembershipAtom, 'premium-monthly');
      await renderSeries({ store });

      expect(screen.queryByRole('button', { name: BUY })).not.toBeOnTheScreen();
    });
  });

  it('shows an error with Retry, and Retry loads the series', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getPrice = repositories.store.getSeasonBundlePrice;
    jest
      .spyOn(repositories.store, 'getSeasonBundlePrice')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(getPrice);
    const QueryWrapper = createTestWrapper({ repositories });
    await render(<SeriesDetailScreen seriesId={SERIES_ID} />, { wrapper: QueryWrapper });

    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('button', { name: 'Play Ep 1' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
  });

  it('shows the loading state first and keeps the back button', async () => {
    await render(<SeriesDetailScreen seriesId={SERIES_ID} />, { wrapper: createTestWrapper() });

    expect(screen.getByLabelText('Loading…')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(await screen.findByRole('button', { name: 'Play Ep 1' })).toBeOnTheScreen();
  });

  it('shows not found for an unknown series, with no Retry', async () => {
    await render(<SeriesDetailScreen seriesId="missing" />, { wrapper: createTestWrapper() });

    expect(await screen.findByText("This title isn't available any more.")).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeOnTheScreen();
  });
});
