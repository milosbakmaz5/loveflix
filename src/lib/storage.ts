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

/** Synchronous storage in the shape `atomWithStorage` expects. */
export type AtomStorage<Value> = {
  getItem: (key: string, initialValue: Value) => Value;
  setItem: (key: string, value: Value) => void;
  removeItem: (key: string) => void;
};

/**
 * JSON storage for `atomWithStorage`. A saved value that fails `isValue` (or isn't valid JSON)
 * is ignored and the atom falls back to its initial value.
 */
export function createAtomStorage<Value>(
  isValue: (value: unknown) => value is Value,
): AtomStorage<Value> {
  const json = createJSONStorage<unknown>(() => syncStorage);
  return {
    getItem: (key, initialValue) => {
      const value = json.getItem(key, initialValue);
      return isValue(value) ? value : initialValue;
    },
    setItem: (key, value) => json.setItem(key, value),
    removeItem: (key) => json.removeItem(key),
  };
}

export function clearStorage(): void {
  mmkv.clearAll();
}
