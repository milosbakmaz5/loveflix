import type { Episode } from '@/domain';

export type EpisodeOrder = 'firstToLast' | 'lastToFirst';

export const COLLAPSED_EPISODE_COUNT = 6;

/** The rows of the episode list: sorted, then cut to the first few until expanded. */
export function getVisibleEpisodes(
  episodes: readonly Episode[],
  order: EpisodeOrder,
  isExpanded: boolean,
): readonly Episode[] {
  const sorted = [...episodes].sort((a, b) =>
    order === 'firstToLast' ? a.number - b.number : b.number - a.number,
  );
  return isExpanded ? sorted : sorted.slice(0, COLLAPSED_EPISODE_COUNT);
}
