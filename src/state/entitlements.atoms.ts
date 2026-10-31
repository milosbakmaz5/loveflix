import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Entitlements, EpisodeId, Membership } from '@/domain';
import { createAtomStorage, STORAGE_KEYS } from '@/lib/storage';

function isEpisodeIdList(value: unknown): value is readonly EpisodeId[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isMembership(value: unknown): value is Membership {
  if (typeof value !== 'object' || value === null || !('status' in value)) {
    return false;
  }
  if (value.status === 'none') {
    return true;
  }
  return value.status === 'active' && 'planId' in value && typeof value.planId === 'string';
}

/** Saved as an array because JSON has no Set. Written only by the action atoms. */
export const storedUnlockedEpisodeIdsAtom = atomWithStorage<readonly EpisodeId[]>(
  STORAGE_KEYS.unlockedEpisodeIds,
  [],
  createAtomStorage(isEpisodeIdList),
  { getOnInit: true },
);

export const storedMembershipAtom = atomWithStorage<Membership>(
  STORAGE_KEYS.membership,
  { status: 'none' },
  createAtomStorage(isMembership),
  { getOnInit: true },
);

/** The set is rebuilt only when the saved list changes. */
export const unlockedEpisodeIdsAtom = atom(
  (get): ReadonlySet<EpisodeId> => new Set(get(storedUnlockedEpisodeIdsAtom)),
);

export const membershipAtom = atom((get) => get(storedMembershipAtom));

/** Everything the user owns, in the shape the domain rules take. */
export const entitlementsAtom = atom((get): Entitlements => ({
  unlockedEpisodeIds: get(unlockedEpisodeIdsAtom),
  membership: get(membershipAtom),
}));
