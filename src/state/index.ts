// Public state API. The stored* atoms stay internal: only the action atoms write them.
//
// Mock scope: this state stands in for server-side ownership and assumes one user per device.
// The saved keys are not per user and nothing clears them on logout (there is no login).
// With real accounts, coins/unlocks/membership come from the API via React Query keyed by
// user id, and each user gets their own jotai store and MMKV instance.
export {
  activateMembershipAtom,
  creditCoinsAtom,
  resetDemoAtom,
  unlockWithAdAtom,
  unlockWithCoinsAtom,
} from './actions.atoms';
export { entitlementsAtom, membershipAtom, unlockedEpisodeIdsAtom } from './entitlements.atoms';
export { type EpisodeAccessState, getEpisodeAccess, useEpisodeAccess } from './useEpisodeAccess';
export { coinBalanceAtom } from './wallet.atoms';
