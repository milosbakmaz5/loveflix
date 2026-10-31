import { DEMO_CONFIG } from '@/config/demo';
import { totalCoins } from '@/domain';

import {
  createMockCatalogRepository,
  createMockStoreRepository,
  isRepositoryError,
  RepositoryError,
} from '..';

const BILLIONAIRES_SECRET = 'billionaires-secret';

const catalog = createMockCatalogRepository({ latencyMs: 0 });
const store = createMockStoreRepository({ latencyMs: 0 });

async function expectRepositoryError(promise: Promise<unknown>, kind: RepositoryError['kind']) {
  const error: unknown = await promise.catch((caught: unknown) => caught);
  expect(isRepositoryError(error)).toBe(true);
  expect(error).toMatchObject({ kind });
}

describe('MockCatalogRepository', () => {
  it('returns the home feed with every referenced series exactly once', async () => {
    const { feed, series } = await catalog.getHomeFeed();
    const referenced = new Set([
      feed.spotlightSeriesId,
      ...feed.categories.flatMap((c) => c.rails.flatMap((r) => r.seriesIds)),
    ]);

    expect(series.map((s) => s.id).sort()).toEqual([...referenced].sort());
  });

  it('returns a series by id', async () => {
    const series = await catalog.getSeries(BILLIONAIRES_SECRET);
    expect(series.id).toBe(BILLIONAIRES_SECRET);
  });

  it('returns all episodes of a series in order', async () => {
    const series = await catalog.getSeries(BILLIONAIRES_SECRET);
    const episodes = await catalog.getEpisodes(BILLIONAIRES_SECRET);

    expect(episodes).toHaveLength(series.episodeCount);
    expect(episodes[0]?.number).toBe(1);
    expect(episodes.every((e) => e.seriesId === BILLIONAIRES_SECRET)).toBe(true);
  });

  it('returns the current user', async () => {
    const user = await catalog.getCurrentUser();
    expect(user.displayName.length).toBeGreaterThan(0);
  });

  it('throws notFound for unknown series ids', async () => {
    await expectRepositoryError(catalog.getSeries('missing'), 'notFound');
    await expectRepositoryError(catalog.getEpisodes('missing'), 'notFound');
  });

  it('returns copies, so callers cannot change the fixtures', async () => {
    const first = await catalog.getSeries(BILLIONAIRES_SECRET);
    (first as { title: string }).title = 'Changed';

    const second = await catalog.getSeries(BILLIONAIRES_SECRET);
    expect(second.title).not.toBe('Changed');
  });
});

describe('MockStoreRepository', () => {
  it('returns coin packs and membership plans', async () => {
    expect((await store.getCoinPacks()).length).toBeGreaterThan(0);
    expect((await store.getMembershipPlans()).length).toBeGreaterThan(0);
  });

  it('grants base plus bonus coins on purchase', async () => {
    const packs = await store.getCoinPacks();
    const pack = packs.find((p) => p.bonusCoins > 0)!;

    await expect(store.purchaseCoinPack(pack.id)).resolves.toEqual({
      packId: pack.id,
      coinsGranted: totalCoins(pack),
    });
  });

  it('throws notFound for an unknown pack', async () => {
    await expectRepositoryError(store.purchaseCoinPack('missing'), 'notFound');
  });
});

describe('simulation options', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('fails only the operations shouldFail selects, with a network error', async () => {
    const failing = createMockCatalogRepository({
      latencyMs: 0,
      shouldFail: (operation) => operation === 'getHomeFeed',
    });

    await expectRepositoryError(failing.getHomeFeed(), 'network');
    await expect(failing.getSeries(BILLIONAIRES_SECRET)).resolves.toBeDefined();
  });

  it('waits the configured latency before answering', async () => {
    jest.useFakeTimers();
    const slow = createMockStoreRepository({ latencyMs: 500 });
    const onDone = jest.fn();

    const pending = slow.getCoinPacks().then(onDone);
    await jest.advanceTimersByTimeAsync(499);
    expect(onDone).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(onDone).toHaveBeenCalled();
  });

  it('defaults to the demo latency', async () => {
    jest.useFakeTimers();
    const onDone = jest.fn();

    const pending = createMockStoreRepository().getMembershipPlans().then(onDone);
    await jest.advanceTimersByTimeAsync(DEMO_CONFIG.mockLatencyMs - 1);
    expect(onDone).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(onDone).toHaveBeenCalled();
  });
});

describe('isRepositoryError', () => {
  it('recognises only RepositoryError', () => {
    expect(isRepositoryError(new RepositoryError('network', 'x'))).toBe(true);
    expect(isRepositoryError(new Error('x'))).toBe(false);
    expect(isRepositoryError('x')).toBe(false);
  });
});
