import type { Episode } from '@/domain';

/** List position of the episode number in the route param; the first one when it isn't known. */
export function getInitialEpisodeIndex(
  episodes: readonly Episode[],
  episodeParam: string | undefined,
): number {
  const index = episodes.findIndex((episode) => String(episode.number) === episodeParam);
  return Math.max(index, 0);
}
