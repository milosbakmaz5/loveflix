import { createStore } from 'jotai';

import { DEMO_CONFIG } from '@/config/demo';
import { buildEpisodeOption, buildSeasonOption, isEpisodeUnlocked } from '@/domain';
import { makeEpisode, NO_ENTITLEMENTS, season } from '@/domain/__tests__/fixtures';
import { STORAGE_KEYS, syncStorage } from '@/lib/storage';
import { clearStorage } from '@/test/clearStorage';

import {
  activateMembershipAtom,
  coinBalanceAtom,
  creditCoinsAtom,
  entitlementsAtom,
  myListSeriesIdsAtom,
  resetDemoAtom,
  toggleMyListAtom,
  unlockedEpisodeIdsAtom,
  unlockWithAdAtom,
  unlockWithCoinsAtom,
} from '..';

type Store = ReturnType<typeof createStore>;

const episode5 = makeEpisode(5);
const episode6 = makeEpisode(6);

let store: Store;

beforeEach(() => {
  clearStorage();
  store = createStore();
});

describe('initial state', () => {
  it('starts with the demo balance, nothing unlocked and no membership', () => {
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
    expect(store.get(entitlementsAtom).membership).toEqual({ status: 'none' });
    expect(store.get(entitlementsAtom)).toEqual(NO_ENTITLEMENTS);
  });
});

describe('unlockWithCoinsAtom', () => {
  it('changes nothing and reports the missing coins when the balance is too low', () => {
    const result = store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5));

    expect(result).toEqual({
      ok: false,
      reason: 'insufficient_coins',
      missingCoins: DEMO_CONFIG.episodePriceCoins - DEMO_CONFIG.startingCoinBalance,
    });
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
    expect(store.get(unlockedEpisodeIdsAtom).size).toBe(0);
  });

  it('pays and unlocks the episode after a top-up', () => {
    store.set(creditCoinsAtom, 300);
    const result = store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5));

    expect(result.ok).toBe(true);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance + 300 - 20);
    expect(isEpisodeUnlocked(episode5, store.get(entitlementsAtom))).toBe(true);
    expect(isEpisodeUnlocked(episode6, store.get(entitlementsAtom))).toBe(false);
  });

  it('never charges twice for the same episode', () => {
    store.set(creditCoinsAtom, 300);
    store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5));
    const balance = store.get(coinBalanceAtom);

    expect(store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5))).toEqual({
      ok: false,
      reason: 'already_unlocked',
    });
    expect(store.get(coinBalanceAtom)).toBe(balance);
  });

  it('unlocks the whole remaining season at the discounted price', () => {
    store.set(creditCoinsAtom, 300);
    const option = buildSeasonOption(season, 5, NO_ENTITLEMENTS, DEMO_CONFIG.seasonDiscountRate)!;

    expect(store.set(unlockWithCoinsAtom, option).ok).toBe(true);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance + 300 - option.cost);
    expect([...store.get(unlockedEpisodeIdsAtom)]).toEqual(option.episodeIds);
  });

  it('saves the new balance and unlocked ids to MMKV', () => {
    store.set(creditCoinsAtom, 300);
    store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5));

    expect(syncStorage.getItem(STORAGE_KEYS.coinBalance)).toBe(String(store.get(coinBalanceAtom)));
    expect(syncStorage.getItem(STORAGE_KEYS.unlockedEpisodeIds)).toBe(
      JSON.stringify([episode5.id]),
    );
  });
});

describe('creditCoinsAtom', () => {
  it('adds the purchased coins', () => {
    store.set(creditCoinsAtom, 850);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance + 850);
  });

  it.each([0, -5, 1.5])('rejects %p coins', (coins) => {
    expect(() => store.set(creditCoinsAtom, coins)).toThrow(RangeError);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
  });
});

describe('unlockWithAdAtom', () => {
  it('unlocks exactly one episode for free, once', () => {
    store.set(unlockWithAdAtom, episode5.id);
    store.set(unlockWithAdAtom, episode5.id);

    expect([...store.get(unlockedEpisodeIdsAtom)]).toEqual([episode5.id]);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
  });
});

describe('activateMembershipAtom', () => {
  it('unlocks every episode', () => {
    store.set(activateMembershipAtom, 'premium-monthly');

    expect(store.get(entitlementsAtom).membership).toEqual({
      status: 'active',
      planId: 'premium-monthly',
    });
    expect(season.every((e) => isEpisodeUnlocked(e, store.get(entitlementsAtom)))).toBe(true);
  });
});

describe('toggleMyListAtom', () => {
  it('adds a series, then removes it, and saves the list', () => {
    store.set(toggleMyListAtom, 's1');
    expect(store.get(myListSeriesIdsAtom)).toEqual(['s1']);
    expect(syncStorage.getItem(STORAGE_KEYS.myListSeriesIds)).toBe('["s1"]');

    store.set(toggleMyListAtom, 's1');
    expect(store.get(myListSeriesIdsAtom)).toEqual([]);
  });
});

describe('resetDemoAtom', () => {
  it('returns to the first-launch state and clears the saved values', () => {
    store.set(creditCoinsAtom, 300);
    store.set(unlockWithCoinsAtom, buildEpisodeOption(episode5));
    store.set(activateMembershipAtom, 'premium-monthly');
    store.set(toggleMyListAtom, 's1');

    store.set(resetDemoAtom);

    expect(store.get(entitlementsAtom)).toEqual(NO_ENTITLEMENTS);
    expect(store.get(coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
    expect(store.get(myListSeriesIdsAtom)).toEqual([]);
    for (const key of Object.values(STORAGE_KEYS)) {
      expect(syncStorage.getItem(key)).toBeNull();
    }
  });
});

describe('app restart', () => {
  // Saved atoms read MMKV once, when their module loads. Loading fresh copies of the
  // modules with data already in storage is what a cold start looks like.
  function startAppWith(saved: Record<string, string>) {
    let state: typeof import('..') | undefined;
    jest.isolateModules(() => {
      const storage = jest.requireActual<typeof import('@/lib/storage')>('@/lib/storage');
      for (const [key, value] of Object.entries(saved)) {
        storage.syncStorage.setItem(key, value);
      }
      state = jest.requireActual<typeof import('..')>('..');
    });
    return { state: state!, store: createStore() };
  }

  it('restores the saved balance, unlocked episodes and membership', () => {
    const { state, store: restarted } = startAppWith({
      [STORAGE_KEYS.coinBalance]: '295',
      [STORAGE_KEYS.unlockedEpisodeIds]: JSON.stringify([episode5.id]),
      [STORAGE_KEYS.membership]: JSON.stringify({ status: 'active', planId: 'vip-weekly' }),
    });

    expect(restarted.get(state.coinBalanceAtom)).toBe(295);
    expect([...restarted.get(state.unlockedEpisodeIdsAtom)]).toEqual([episode5.id]);
    expect(restarted.get(state.entitlementsAtom).membership).toEqual({
      status: 'active',
      planId: 'vip-weekly',
    });
  });

  it('falls back to the defaults when saved data is damaged', () => {
    const { state, store: restarted } = startAppWith({
      [STORAGE_KEYS.coinBalance]: '-5',
      [STORAGE_KEYS.unlockedEpisodeIds]: 'not json',
      [STORAGE_KEYS.membership]: JSON.stringify({ status: 'active' }),
    });

    expect(restarted.get(state.coinBalanceAtom)).toBe(DEMO_CONFIG.startingCoinBalance);
    expect(restarted.get(state.unlockedEpisodeIdsAtom).size).toBe(0);
    expect(restarted.get(state.entitlementsAtom).membership).toEqual({ status: 'none' });
  });
});
