// Domain models. Pure types — no React, no React Native, no imports.

export type SeriesId = string;
export type EpisodeId = string;
export type CastMemberId = string;
export type CoinPackId = string;
export type MembershipPlanId = string;

/** A bundled asset (`require(...)` result) or a remote URL. */
export type ImageRef = number | { uri: string };

export type Currency = 'EUR' | 'USD';

export type Money = {
  /** Amount in minor units (cents) to avoid floating-point errors. */
  amountMinor: number;
  currency: Currency;
};

export type Genre =
  'romance' | 'drama' | 'billionaire' | 'action' | 'mystery' | 'fantasy' | 'historical';

export type CastMember = {
  id: CastMemberId;
  name: string;
  role: string;
  /** Missing when there is no photo — the UI falls back to initials. */
  avatar?: ImageRef;
};

export type UserProfile = {
  id: string;
  displayName: string;
  avatar?: ImageRef;
};

export type Series = {
  id: SeriesId;
  title: string;
  tagline: string;
  synopsis: string;
  genres: readonly Genre[];
  tags: readonly string[];
  rating: number;
  ratingCount: number;
  year: number;
  episodeCount: number;
  minutesPerEpisode: number;
  isPro: boolean;
  posterImage: ImageRef;
  heroImage: ImageRef;
  cast: readonly CastMember[];
  highlights: readonly string[];
};

export type EpisodeAccess = { type: 'free' } | { type: 'coins'; price: number };

export type Episode = {
  id: EpisodeId;
  seriesId: SeriesId;
  /** 1-based position in the season. */
  number: number;
  title: string;
  durationSec: number;
  thumbnail: ImageRef;
  videoUri: string;
  access: EpisodeAccess;
};

export type CoinPackBadge = 'popular' | 'bestValue';

export type CoinPack = {
  id: CoinPackId;
  coins: number;
  bonusCoins: number;
  price: Money;
  badge?: CoinPackBadge;
};

export type MembershipPeriod = 'week' | 'month';

export type MembershipPlan = {
  id: MembershipPlanId;
  price: Money;
  period: MembershipPeriod;
};

export type Membership = { status: 'none' } | { status: 'active'; planId: MembershipPlanId };

export type Entitlements = {
  unlockedEpisodeIds: ReadonlySet<EpisodeId>;
  membership: Membership;
};

export type UnlockOption =
  | { type: 'episode'; episodeId: EpisodeId; cost: number }
  | {
      type: 'season';
      seriesId: SeriesId;
      fromEpisode: number;
      toEpisode: number;
      episodeIds: readonly EpisodeId[];
      cost: number;
    }
  | { type: 'membership'; plan: MembershipPlan }
  | { type: 'ad'; episodeId: EpisodeId };

export type UnlockOptionType = UnlockOption['type'];

export type SeriesRail = {
  id: string;
  title: string;
  seriesIds: readonly SeriesId[];
};

export type FeedCategory = {
  id: string;
  title: string;
  rails: readonly SeriesRail[];
};

export type HomeFeed = {
  spotlightSeriesId: SeriesId;
  genres: readonly Genre[];
  categories: readonly FeedCategory[];
};
