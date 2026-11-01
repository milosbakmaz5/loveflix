import { renderHook } from '@testing-library/react-native';
import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';

import { makeEpisode } from '@/domain/__tests__/fixtures';
import { clearStorage } from '@/test/clearStorage';

import { activateMembershipAtom, unlockWithAdAtom, useEpisodeAccess } from '..';

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
    expect((await renderAccess(freeEpisode)).isUnlocked).toBe(true);
  });

  it('reports a paid episode as locked', async () => {
    expect((await renderAccess()).isUnlocked).toBe(false);
  });

  it('unlocks with an ad or a membership', async () => {
    store.set(unlockWithAdAtom, paidEpisode.id);
    expect((await renderAccess()).isUnlocked).toBe(true);

    clearStorage();
    store = createStore();
    store.set(activateMembershipAtom, 'premium-monthly');
    expect((await renderAccess(makeEpisode(30))).isUnlocked).toBe(true);
  });
});
