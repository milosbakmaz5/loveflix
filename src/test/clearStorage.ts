import { STORAGE_KEYS, syncStorage } from '@/lib/storage';

export function clearStorage(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    syncStorage.removeItem(key);
  }
}
