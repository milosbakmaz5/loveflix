import { createJSONStorage } from 'jotai/utils';
import { createMMKV } from 'react-native-mmkv';

export const STORAGE_KEYS = {
  coinBalance: 'wallet.coinBalance',
  unlockedEpisodeIds: 'entitlements.unlockedEpisodeIds',
  membership: 'entitlements.membership',
} as const;

const mmkv = createMMKV({ id: 'loveflix' });

// MMKV is synchronous, so persisted atoms can read their value on first render.
export const syncStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string): void => mmkv.set(key, value),
  removeItem: (key: string): void => {
    mmkv.remove(key);
  },
};

export function createAtomStorage<Value>() {
  return createJSONStorage<Value>(() => syncStorage);
}

export function clearStorage(): void {
  mmkv.clearAll();
}
