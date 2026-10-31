import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { DEMO_CONFIG } from '@/config/demo';
import { createAtomStorage, STORAGE_KEYS } from '@/lib/storage';

function isCoinBalance(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** Saved balance. Written only by the action atoms. */
export const storedCoinBalanceAtom = atomWithStorage<number>(
  STORAGE_KEYS.coinBalance,
  DEMO_CONFIG.startingCoinBalance,
  createAtomStorage(isCoinBalance),
  // MMKV is synchronous: read the saved value up front so the default never flashes.
  { getOnInit: true },
);

export const coinBalanceAtom = atom((get) => get(storedCoinBalanceAtom));
