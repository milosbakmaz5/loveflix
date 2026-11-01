import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { SeriesId } from '@/domain';
import { createAtomStorage, STORAGE_KEYS } from '@/lib/storage';

function isSeriesIdList(value: unknown): value is readonly SeriesId[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export const myListSeriesIdsAtom = atomWithStorage<readonly SeriesId[]>(
  STORAGE_KEYS.myListSeriesIds,
  [],
  createAtomStorage(isSeriesIdList),
  { getOnInit: true },
);

export const toggleMyListAtom = atom(null, (get, set, seriesId: SeriesId) => {
  const ids = get(myListSeriesIdsAtom);
  set(
    myListSeriesIdsAtom,
    ids.includes(seriesId) ? ids.filter((id) => id !== seriesId) : [...ids, seriesId],
  );
});
