import { renderHook } from '@testing-library/react-native';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { DEMO_CONFIG } from '@/config/demo';
import { makeEpisode } from '@/domain/__tests__/fixtures';
import { clearStorage } from '@/lib/storage';

import { activateMembershipAtom, creditCoinsAtom, unlockWithAdAtom, useEpisodeAccess } from '..';

const freeEpisode = makeEpisode(1);
const paidEpisode = makeEpisode(5);

let store: ReturnType<typeof createStore>;

beforeEach(() => {
  clearStorage();
  store = createStore();
});

function wrapper({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

async function renderAccess(episode = paidEpisode) {
  const { result } = await renderHook(() => useEpisodeAccess(episode), { wrapper });
  return result.current;
}

describe('useEpisodeAccess', () => {
  it('treats a free episode as unlocked', async () => {
    expect(await renderAccess(freeEpisode)).toEqual({
      isUnlocked: true,
      cost: 0,
      canAfford: true,
      missingCoins: 0,
    });
  });

  it('reports a locked episode the user cannot afford', async () => {
    expect(await renderAccess()).toEqual({
      isUnlocked: false,
      cost: DEMO_CONFIG.episodePriceCoins,
      canAfford: false,
      missingCoins: DEMO_CONFIG.episodePriceCoins - DEMO_CONFIG.startingCoinBalance,
    });
  });

  it('reports a locked episode the user can afford', async () => {
    store.set(creditCoinsAtom, 300);
    expect(await renderAccess()).toMatchObject({
      isUnlocked: false,
      canAfford: true,
      missingCoins: 0,
    });
  });

  it('unlocks with an ad or a membership', async () => {
    store.set(unlockWithAdAtom, paidEpisode.id);
    expect((await renderAccess()).isUnlocked).toBe(true);

    clearStorage();
    store = createStore();
    store.set(activateMembershipAtom, 'premium-monthly');
    expect(await renderAccess(makeEpisode(30))).toMatchObject({ isUnlocked: true, cost: 0 });
  });
});
