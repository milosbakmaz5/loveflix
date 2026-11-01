import { useAtomValue } from 'jotai';

import { type Episode, isEpisodeUnlocked } from '@/domain';

import { entitlementsAtom } from './entitlements.atoms';

type EpisodeAccessState = {
  isUnlocked: boolean;
};

/** Lock state of one episode (jotai 3 has no atomFamily, so it derives from the shared atoms). */
export function useEpisodeAccess(episode: Episode): EpisodeAccessState {
  const entitlements = useAtomValue(entitlementsAtom);
  return { isUnlocked: isEpisodeUnlocked(episode, entitlements) };
}
