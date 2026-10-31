import type { Series, SeriesId } from '@/domain';
import { createEpisodes, currentUser, homeFeed, seriesCatalog } from '@/data/mocks';

import type { CatalogRepository } from './CatalogRepository';
import { RepositoryError } from './errors';
import { createSimulate, type MockRepositoryOptions } from './simulate';

function findSeries(id: SeriesId): Series {
  const series = seriesCatalog.find((item) => item.id === id);
  if (series === undefined) {
    throw new RepositoryError('notFound', `Series "${id}" not found`);
  }
  return series;
}

function feedSeriesIds(): ReadonlySet<SeriesId> {
  const railIds = homeFeed.categories.flatMap((category) =>
    category.rails.flatMap((rail) => rail.seriesIds),
  );
  return new Set([homeFeed.spotlightSeriesId, ...railIds]);
}

export function createMockCatalogRepository(options?: MockRepositoryOptions): CatalogRepository {
  const simulate = createSimulate(options);

  return {
    getHomeFeed: () =>
      simulate('getHomeFeed', () => ({
        feed: homeFeed,
        series: [...feedSeriesIds()].map(findSeries),
      })),
    getSeries: (id) => simulate('getSeries', () => findSeries(id)),
    getEpisodes: (seriesId) => simulate('getEpisodes', () => createEpisodes(findSeries(seriesId))),
    getCurrentUser: () => simulate('getCurrentUser', () => currentUser),
  };
}
