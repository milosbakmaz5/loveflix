import {
  activateMembership,
  buildEpisodeOption,
  buildSeasonOption,
  buildUnlockOptions,
  getEpisodeCost,
  grantEpisodes,
  isEpisodeUnlocked,
  unlockWithCoins,
} from '@/domain';

import { entitlements, monthlyPlan, NO_ENTITLEMENTS, season } from './fixtures';

const ep4 = season[3]!;
const ep5 = season[4]!;
const ep6 = season[5]!;

describe('isEpisodeUnlocked', () => {
  it('free episodes are always unlocked', () => {
    expect(isEpisodeUnlocked(ep4, NO_ENTITLEMENTS)).toBe(true);
  });

  it('paid episodes are locked until purchased', () => {
    expect(isEpisodeUnlocked(ep5, NO_ENTITLEMENTS)).toBe(false);
    expect(isEpisodeUnlocked(ep5, entitlements(['s1-e5']))).toBe(true);
  });

  it('an active membership unlocks everything', () => {
    expect(isEpisodeUnlocked(ep5, entitlements([], activateMembership('premium')))).toBe(true);
  });
});

describe('episode cost', () => {
  it('free episodes cost nothing', () => {
    expect(getEpisodeCost(ep4)).toBe(0);
    expect(getEpisodeCost(ep5)).toBe(20);
    expect(buildEpisodeOption(ep5)).toEqual({ type: 'episode', episodeId: 's1-e5', cost: 20 });
  });
});

describe('buildSeasonOption', () => {
  it('bundles the remaining locked episodes with a discount', () => {
    expect(buildSeasonOption(season, 5, NO_ENTITLEMENTS, 0.4)).toEqual({
      type: 'season',
      seriesId: 's1',
      fromEpisode: 5,
      toEpisode: 10,
      episodeIds: ['s1-e5', 's1-e6', 's1-e7', 's1-e8', 's1-e9', 's1-e10'],
      cost: 72, // 6 × 20 = 120, 40% off
    });
  });

  it('skips episodes the user already owns', () => {
    const option = buildSeasonOption(season, 5, entitlements(['s1-e5', 's1-e10']), 0);
    expect(option?.fromEpisode).toBe(6);
    expect(option?.toEpisode).toBe(9);
    expect(option?.cost).toBe(80);
  });

  it('is undefined when nothing is left to unlock', () => {
    expect(buildSeasonOption(season, 11, NO_ENTITLEMENTS, 0.4)).toBeUndefined();
  });

  it.each([-0.1, 1])('rejects discount rate %d', (rate) => {
    expect(() => buildSeasonOption(season, 5, NO_ENTITLEMENTS, rate)).toThrow(RangeError);
  });
});

describe('buildUnlockOptions', () => {
  it('lists episode, season, membership and ad in display order', () => {
    const options = buildUnlockOptions({
      episode: ep5,
      seasonEpisodes: season,
      entitlements: NO_ENTITLEMENTS,
      plans: [monthlyPlan],
      seasonDiscountRate: 0.4,
    });
    expect(options.map((o) => o.type)).toEqual(['episode', 'season', 'membership', 'ad']);
  });

  it('leaves out the season option for the last episode once the rest are owned', () => {
    const lastEpisode = season[9]!;
    const options = buildUnlockOptions({
      episode: lastEpisode,
      seasonEpisodes: season,
      entitlements: entitlements(['s1-e10']),
      plans: [],
      seasonDiscountRate: 0.4,
    });
    expect(options.map((o) => o.type)).toEqual(['episode', 'ad']);
  });
});

describe('unlockWithCoins', () => {
  it('pays for an episode and grants it', () => {
    const result = unlockWithCoins(100, buildEpisodeOption(ep5), NO_ENTITLEMENTS);
    expect(result).toEqual({ ok: true, balance: 80, unlockedEpisodeIds: new Set(['s1-e5']) });
  });

  it('pays for a season and grants every episode in it', () => {
    const option = buildSeasonOption(season, 5, NO_ENTITLEMENTS, 0.4)!;
    const result = unlockWithCoins(100, option, NO_ENTITLEMENTS);
    expect(result.ok && result.balance).toBe(28);
    expect(result.ok && [...result.unlockedEpisodeIds]).toHaveLength(6);
  });

  it('keeps previously unlocked episodes', () => {
    const result = unlockWithCoins(100, buildEpisodeOption(ep6), entitlements(['s1-e5']));
    expect(result.ok && [...result.unlockedEpisodeIds]).toEqual(['s1-e5', 's1-e6']);
  });

  it('reports missing coins without changing anything', () => {
    expect(unlockWithCoins(15, buildEpisodeOption(ep5), NO_ENTITLEMENTS)).toEqual({
      ok: false,
      reason: 'insufficient_coins',
      missingCoins: 5,
    });
  });

  it('does not charge twice for an owned episode', () => {
    expect(unlockWithCoins(100, buildEpisodeOption(ep5), entitlements(['s1-e5']))).toEqual({
      ok: false,
      reason: 'already_unlocked',
    });
  });

  it('does not charge members', () => {
    const members = entitlements([], activateMembership('premium'));
    expect(unlockWithCoins(100, buildEpisodeOption(ep5), members)).toEqual({
      ok: false,
      reason: 'already_unlocked',
    });
  });
});

describe('grantEpisodes', () => {
  it('returns a new set and never mutates the input', () => {
    const before: ReadonlySet<string> = new Set(['a']);
    const after = grantEpisodes(before, ['b', 'a']);
    expect([...after]).toEqual(['a', 'b']);
    expect([...before]).toEqual(['a']);
  });
});
