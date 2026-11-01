import type { Series } from '@/domain';

const MAX_RELATED = 8;

function countSharedGenres(a: Series, b: Series): number {
  return a.genres.filter((genre) => b.genres.includes(genre)).length;
}

/** Other series in the catalog, those with the most genres in common first. */
export function getRelatedSeries(series: Series, catalog: readonly Series[]): readonly Series[] {
  return catalog
    .filter((other) => other.id !== series.id && countSharedGenres(series, other) > 0)
    .sort((a, b) => countSharedGenres(series, b) - countSharedGenres(series, a))
    .slice(0, MAX_RELATED);
}
