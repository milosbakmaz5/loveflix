import { useAtomValue, useSetAtom } from 'jotai';

import type { SeriesId } from '@/domain';

import { myListSeriesIdsAtom, toggleMyListAtom } from '../state/myList.atom';

type MyListEntry = {
  isInList: boolean;
  toggle: () => void;
};

export function useMyList(seriesId: SeriesId): MyListEntry {
  const isInList = useAtomValue(myListSeriesIdsAtom).includes(seriesId);
  const toggleMyList = useSetAtom(toggleMyListAtom);
  return { isInList, toggle: () => toggleMyList(seriesId) };
}
