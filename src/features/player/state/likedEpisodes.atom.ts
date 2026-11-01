import { atom } from 'jotai';

import type { EpisodeId } from '@/domain';

/** In memory only: likes have no backend in the mock. Shared because list cells are recycled. */
export const likedEpisodeIdsAtom = atom<ReadonlySet<EpisodeId>>(new Set<EpisodeId>());

export const toggleEpisodeLikeAtom = atom(null, (get, set, episodeId: EpisodeId) => {
  const liked = new Set(get(likedEpisodeIdsAtom));
  if (!liked.delete(episodeId)) {
    liked.add(episodeId);
  }
  set(likedEpisodeIdsAtom, liked);
});
