import { act, renderHook, waitFor } from '@testing-library/react-native';

import {
  createMockRepositories,
  type Repositories,
  useCoinPacks,
  useCurrentUser,
  useEpisodes,
  useHomeFeed,
  useMembershipPlans,
  usePurchaseCoinPack,
  useRepositories,
  useSeries,
} from '@/data';
import { createGate } from '@/test/createGate';
import { createTestQueryClient, createTestWrapper } from '@/test/queryTestUtils';

const BILLIONAIRES_SECRET = 'billionaires-secret';

function failingRepositories(): Repositories {
  return createMockRepositories({ latencyMs: 0, shouldFail: () => true });
}

describe('catalog queries', () => {
  it('useHomeFeed loads the feed and its series', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getHomeFeed = repositories.catalog.getHomeFeed;
    const gate = createGate();
    jest
      .spyOn(repositories.catalog, 'getHomeFeed')
      .mockImplementation(() => gate.opened.then(() => getHomeFeed()));
    const { result } = await renderHook(() => useHomeFeed(), {
      wrapper: createTestWrapper({ repositories }),
    });

    expect(result.current.isPending).toBe(true);
    gate.open();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.series.length).toBeGreaterThan(0);
  });

  it('useHomeFeed seeds the series cache, so useSeries needs no request', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getSeries = jest.spyOn(repositories.catalog, 'getSeries');
    const wrapper = createTestWrapper({ repositories, queryClient: createTestQueryClient() });

    const feed = await renderHook(() => useHomeFeed(), { wrapper });
    await waitFor(() => expect(feed.result.current.isSuccess).toBe(true));

    const series = await renderHook(() => useSeries(BILLIONAIRES_SECRET), { wrapper });
    expect(series.result.current.data?.id).toBe(BILLIONAIRES_SECRET);
    expect(getSeries).not.toHaveBeenCalled();
  });

  it('useSeries reports notFound as an error', async () => {
    const { result } = await renderHook(() => useSeries('missing'), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ kind: 'notFound' });
  });

  it('useEpisodes loads the episodes of a series', async () => {
    const { result } = await renderHook(() => useEpisodes(BILLIONAIRES_SECRET), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0]?.seriesId).toBe(BILLIONAIRES_SECRET);
  });

  it('useCurrentUser loads the profile', async () => {
    const { result } = await renderHook(() => useCurrentUser(), { wrapper: createTestWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.displayName).toBeTruthy();
  });

  it('surfaces network errors', async () => {
    const { result } = await renderHook(() => useHomeFeed(), {
      wrapper: createTestWrapper({ repositories: failingRepositories() }),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ kind: 'network' });
  });
});

describe('store queries', () => {
  it('useCoinPacks and useMembershipPlans load the store', async () => {
    const wrapper = createTestWrapper();
    const packs = await renderHook(() => useCoinPacks(), { wrapper });
    const plans = await renderHook(() => useMembershipPlans(), { wrapper });

    await waitFor(() => expect(packs.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(plans.result.current.isSuccess).toBe(true));
    expect(packs.result.current.data?.length).toBeGreaterThan(0);
    expect(plans.result.current.data?.length).toBeGreaterThan(0);
  });
});

describe('usePurchaseCoinPack', () => {
  it('is pending while the payment runs, then returns the receipt', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const purchase = repositories.store.purchaseCoinPack;
    // Hold the payment open until the test releases it, so the pending state is deterministic.
    let releasePayment = () => {};
    const paymentReleased = new Promise<void>((resolve) => {
      releasePayment = resolve;
    });
    jest
      .spyOn(repositories.store, 'purchaseCoinPack')
      .mockImplementation((packId) => paymentReleased.then(() => purchase(packId)));
    const { result } = await renderHook(() => usePurchaseCoinPack(), {
      wrapper: createTestWrapper({ repositories }),
    });

    await act(async () => {
      result.current.mutate('coins-300');
    });
    // React Query notifies observers on the next tick, so wait for it.
    await waitFor(() => expect(result.current.isPending).toBe(true));

    await act(async () => {
      releasePayment();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ packId: 'coins-300', coinsGranted: 300 });
  });

  it('reports a failed payment', async () => {
    const { result } = await renderHook(() => usePurchaseCoinPack(), {
      wrapper: createTestWrapper({ repositories: failingRepositories() }),
    });

    await act(async () => {
      result.current.mutate('coins-300');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ kind: 'network' });
  });
});

describe('useRepositories', () => {
  it('throws outside RepositoryProvider', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(renderHook(() => useRepositories())).rejects.toThrow(
      'useRepositories must be used inside <RepositoryProvider>',
    );
    consoleError.mockRestore();
  });
});
