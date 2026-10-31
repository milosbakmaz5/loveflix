import type { SeriesId } from '@/domain';

// Every React Query key in one place. Series episodes nest under the series key,
// so invalidating a series also invalidates its episodes.
export const queryKeys = {
  homeFeed: () => ['homeFeed'] as const,
  series: (id: SeriesId) => ['series', id] as const,
  episodes: (seriesId: SeriesId) => ['series', seriesId, 'episodes'] as const,
  currentUser: () => ['currentUser'] as const,
  coinPacks: () => ['store', 'coinPacks'] as const,
  membershipPlans: () => ['store', 'membershipPlans'] as const,
};
