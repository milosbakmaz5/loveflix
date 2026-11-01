import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { SeriesId } from '@/domain';
import { createAtomStorage, STORAGE_KEYS } from '@/lib/storage';

function isSeriesIdList(value: unknown): value is readonly SeriesId[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** Written only by the action atoms. */
export const storedMyListSeriesIdsAtom = atomWithStorage<readonly SeriesId[]>(
  STORAGE_KEYS.myListSeriesIds,
  [],
  createAtomStorage(isSeriesIdList),
  { getOnInit: true },
);

export const myListSeriesIdsAtom = atom((get) => get(storedMyListSeriesIdsAtom));
