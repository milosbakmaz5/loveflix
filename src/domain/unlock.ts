import type {
  Entitlements,
  Episode,
  EpisodeId,
  Membership,
  MembershipPlan,
  MembershipPlanId,
  UnlockOption,
} from './models';
import { spendCoins } from './wallet';

export type CoinUnlockOption = Extract<UnlockOption, { type: 'episode' | 'season' }>;
type SeasonUnlockOption = Extract<UnlockOption, { type: 'season' }>;

export type UnlockResult =
  | { ok: true; balance: number; unlockedEpisodeIds: ReadonlySet<EpisodeId> }
  | { ok: false; reason: 'insufficient_coins'; missingCoins: number }
  | { ok: false; reason: 'already_unlocked' };

export function isEpisodeUnlocked(episode: Episode, entitlements: Entitlements): boolean {
  return (
    episode.access.type === 'free' ||
    entitlements.membership.status === 'active' ||
    entitlements.unlockedEpisodeIds.has(episode.id)
  );
}

function getLockedEpisodes(episodes: readonly Episode[], entitlements: Entitlements): Episode[] {
  return [...episodes]
    .sort((a, b) => a.number - b.number)
    .filter((episode) => !isEpisodeUnlocked(episode, entitlements));
}

export function getEpisodeCost(episode: Episode): number {
  return episode.access.type === 'coins' ? episode.access.price : 0;
}

export function buildEpisodeOption(episode: Episode): CoinUnlockOption {
  return { type: 'episode', episodeId: episode.id, cost: getEpisodeCost(episode) };
}

/**
 * Bundles every still-locked episode from `fromEpisode` to the end of the season,
 * discounted by `discountRate` (0.4 = 40% off). Undefined when nothing is left to unlock.
 */
export function buildSeasonOption(
  episodes: readonly Episode[],
  fromEpisode: number,
  entitlements: Entitlements,
  discountRate: number,
): SeasonUnlockOption | undefined {
  if (discountRate < 0 || discountRate >= 1) {
    throw new RangeError(`discountRate must be in [0, 1), got ${discountRate}`);
  }
  const remaining = getLockedEpisodes(episodes, entitlements).filter(
    (episode) => episode.number >= fromEpisode,
  );
  const first = remaining[0];
  const last = remaining.at(-1);
  if (first === undefined || last === undefined) {
    return undefined;
  }
  const fullPrice = remaining.reduce((sum, episode) => sum + getEpisodeCost(episode), 0);
  return {
    type: 'season',
    seriesId: first.seriesId,
    fromEpisode: first.number,
    toEpisode: last.number,
    episodeIds: remaining.map((episode) => episode.id),
    cost: Math.round(fullPrice * (1 - discountRate)),
  };
}

type BuildUnlockOptionsInput = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  entitlements: Entitlements;
  plans: readonly MembershipPlan[];
  seasonDiscountRate: number;
};

/** Options shown in the unlock sheet, in display order. */
export function buildUnlockOptions({
  episode,
  seasonEpisodes,
  entitlements,
  plans,
  seasonDiscountRate,
}: BuildUnlockOptionsInput): UnlockOption[] {
  const season = buildSeasonOption(
    seasonEpisodes,
    episode.number,
    entitlements,
    seasonDiscountRate,
  );
  return [
    buildEpisodeOption(episode),
    ...(season ? [season] : []),
    ...plans.map((plan): UnlockOption => ({ type: 'membership', plan })),
    { type: 'ad', episodeId: episode.id },
  ];
}

function getOptionEpisodeIds(option: CoinUnlockOption): readonly EpisodeId[] {
  return option.type === 'episode' ? [option.episodeId] : option.episodeIds;
}

export function grantEpisodes(
  unlockedEpisodeIds: ReadonlySet<EpisodeId>,
  episodeIds: readonly EpisodeId[],
): ReadonlySet<EpisodeId> {
  return new Set([...unlockedEpisodeIds, ...episodeIds]);
}

/** Pays for an episode or season with coins and returns the new balance and entitlements. */
export function unlockWithCoins(
  balance: number,
  option: CoinUnlockOption,
  entitlements: Entitlements,
): UnlockResult {
  const episodeIds = getOptionEpisodeIds(option);
  const alreadyOwned =
    entitlements.membership.status === 'active' ||
    episodeIds.every((id) => entitlements.unlockedEpisodeIds.has(id));
  if (alreadyOwned) {
    return { ok: false, reason: 'already_unlocked' };
  }
  const payment = spendCoins(balance, option.cost);
  if (!payment.ok) {
    return payment;
  }
  return {
    ok: true,
    balance: payment.balance,
    unlockedEpisodeIds: grantEpisodes(entitlements.unlockedEpisodeIds, episodeIds),
  };
}

export function activateMembership(planId: MembershipPlanId): Membership {
  return { status: 'active', planId };
}
