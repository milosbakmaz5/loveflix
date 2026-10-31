import type { Episode, HomeFeed, Series, SeriesId, UserProfile } from '@/domain';

export type HomeFeedData = {
  feed: HomeFeed;
  /** Every series the feed references, so Home needs no extra requests. */
  series: readonly Series[];
};

export type CatalogRepository = {
  getHomeFeed(): Promise<HomeFeedData>;
  /** Throws `RepositoryError('notFound')` for an unknown id. */
  getSeries(id: SeriesId): Promise<Series>;
  /** Episodes ordered by number. Throws `RepositoryError('notFound')` for an unknown series. */
  getEpisodes(seriesId: SeriesId): Promise<readonly Episode[]>;
  getCurrentUser(): Promise<UserProfile>;
};
