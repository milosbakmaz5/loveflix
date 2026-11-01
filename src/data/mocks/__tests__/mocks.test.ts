import { DEMO_CONFIG } from '@/config/demo';
import { findPackCovering, getMissingCoins, isEpisodeUnlocked, totalCoins } from '@/domain';
import { NO_ENTITLEMENTS } from '@/domain/__tests__/fixtures';

import {
  coinPacks,
  createEpisodes,
  homeFeed,
  images,
  membershipPlans,
  SERIES_IDS,
  seriesCatalog,
  VIDEO_SOURCES,
} from '..';

const catalogIds = new Set(seriesCatalog.map((series) => series.id));
const billionairesSecret = seriesCatalog.find((s) => s.id === SERIES_IDS.billionairesSecret)!;

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

describe('series catalog', () => {
  it('has unique ids and contains every SERIES_IDS entry', () => {
    expect(hasUniqueValues(seriesCatalog.map((s) => s.id))).toBe(true);
    for (const id of Object.values(SERIES_IDS)) {
      expect(catalogIds).toContain(id);
    }
  });

  it.each(seriesCatalog.map((s) => [s.id, s] as const))('%s has sane values', (_, series) => {
    expect(series.title.length).toBeGreaterThan(0);
    expect(series.episodeCount).toBeGreaterThan(DEMO_CONFIG.freeEpisodeCount);
    expect(series.rating).toBeGreaterThanOrEqual(0);
    expect(series.rating).toBeLessThanOrEqual(5);
    expect(series.genres.length).toBeGreaterThan(0);
    expect(series.posterImage).toBeDefined();
    expect(series.heroImage).toBeDefined();
  });
});

describe('home feed', () => {
  const rails = homeFeed.categories.flatMap((category) => category.rails);

  it('only references series from the catalog', () => {
    expect(catalogIds).toContain(homeFeed.spotlightSeriesId);
    for (const rail of rails) {
      for (const id of rail.seriesIds) {
        expect(catalogIds).toContain(id);
      }
    }
  });

  it('has unique, non-empty rails', () => {
    expect(hasUniqueValues(rails.map((rail) => rail.id))).toBe(true);
    for (const rail of rails) {
      expect(rail.seriesIds.length).toBeGreaterThan(0);
      expect(hasUniqueValues(rail.seriesIds)).toBe(true);
    }
  });

  it('starts with the main demo series so the flow is easy to reach', () => {
    expect(rails[0]?.seriesIds[0]).toBe(SERIES_IDS.billionairesSecret);
  });
});

describe('createEpisodes', () => {
  const episodes = createEpisodes(billionairesSecret);

  it('creates one episode per count, numbered from 1, with unique ids', () => {
    expect(episodes).toHaveLength(billionairesSecret.episodeCount);
    expect(episodes.map((e) => e.number)).toEqual(
      Array.from({ length: billionairesSecret.episodeCount }, (_, i) => i + 1),
    );
    expect(hasUniqueValues(episodes.map((e) => e.id))).toBe(true);
  });

  it('makes the first episodes free and the rest paid', () => {
    for (const episode of episodes) {
      const expected =
        episode.number <= DEMO_CONFIG.freeEpisodeCount
          ? { type: 'free' }
          : { type: 'coins', price: DEMO_CONFIG.episodePriceCoins };
      expect(episode.access).toEqual(expected);
    }
  });

  it('uses known video sources and positive durations', () => {
    for (const episode of episodes) {
      expect(VIDEO_SOURCES).toContain(episode.video);
      expect(episode.durationSec).toBeGreaterThan(0);
    }
  });

  it('uses the designed artwork for episodes 1, 5 and 6', () => {
    expect(episodes[0]?.thumbnail).toBe(images.episodes.billionairesSecret1);
    expect(episodes[4]?.thumbnail).toBe(images.episodes.billionairesSecret5);
    expect(episodes[5]?.thumbnail).toBe(images.episodes.billionairesSecret6);
  });

  it('is deterministic', () => {
    expect(createEpisodes(billionairesSecret)).toEqual(episodes);
  });
});

describe('store', () => {
  it('has unique coin packs with positive amounts and one of each badge', () => {
    expect(hasUniqueValues(coinPacks.map((p) => p.id))).toBe(true);
    for (const pack of coinPacks) {
      expect(pack.coins).toBeGreaterThan(0);
      expect(pack.price.amountMinor).toBeGreaterThan(0);
    }
    expect(coinPacks.filter((p) => p.badge === 'popular')).toHaveLength(1);
    expect(coinPacks.filter((p) => p.badge === 'bestValue')).toHaveLength(1);
  });

  it('has unique membership plans', () => {
    expect(hasUniqueValues(membershipPlans.map((p) => p.id))).toBe(true);
  });
});

describe('demo flow invariants', () => {
  const episodes = createEpisodes(billionairesSecret);

  it('locks the episode right after the free ones', () => {
    const firstLocked = episodes.find((episode) => !isEpisodeUnlocked(episode, NO_ENTITLEMENTS));
    expect(firstLocked?.number).toBe(DEMO_CONFIG.freeEpisodeCount + 1);
  });

  it('cannot afford the first unlock with the starting balance', () => {
    expect(
      getMissingCoins(DEMO_CONFIG.startingCoinBalance, DEMO_CONFIG.episodePriceCoins),
    ).toBeGreaterThan(0);
  });

  it('any coin pack is enough to unlock the episode afterwards', () => {
    const missing = getMissingCoins(DEMO_CONFIG.startingCoinBalance, DEMO_CONFIG.episodePriceCoins);
    const cheapest = findPackCovering(coinPacks, 0)!;
    expect(totalCoins(cheapest)).toBeGreaterThanOrEqual(missing);
  });
});
