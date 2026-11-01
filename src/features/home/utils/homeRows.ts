import { getPosterCardHeight } from '@/components/ui';
import type { Genre, HomeFeed, Series, SeriesId } from '@/domain';
import { spacing } from '@/theme';

export type GenreFilter = Genre | 'all';

export type HomeRow =
  | { type: 'hero'; id: 'hero'; series: Series }
  | { type: 'genreFilter'; id: 'genre-filter' }
  | { type: 'category'; id: string; title: string; highlighted: boolean }
  | { type: 'rail'; id: string; title: string; series: readonly Series[] }
  | { type: 'empty'; id: 'empty' };

// Fixed row heights: the sections size themselves to these, and the footer filler adds them up.
export const GENRE_BAR_HEIGHT = 56;
export const CATEGORY_ROW_HEIGHT = 30 + spacing.lg + spacing.md;
const RAIL_TITLE_HEIGHT = 22;
export const RAIL_ROW_HEIGHT =
  RAIL_TITLE_HEIGHT + spacing.sm + getPosterCardHeight('md') + spacing.lg;
export const EMPTY_ROW_HEIGHT = 240;

function matchesGenre(series: Series, genre: GenreFilter): boolean {
  return genre === 'all' || series.genres.includes(genre);
}

/**
 * The whole Home list: hero, genre bar, then the feed filtered by genre. Rails and categories
 * left empty by the filter disappear. Ids missing from `series` are skipped.
 */
export function buildHomeRows(
  feed: HomeFeed,
  series: readonly Series[],
  genre: GenreFilter,
): readonly HomeRow[] {
  const seriesById = new Map<SeriesId, Series>(series.map((item) => [item.id, item]));
  const spotlight = seriesById.get(feed.spotlightSeriesId);
  const rows: HomeRow[] = spotlight ? [{ type: 'hero', id: 'hero', series: spotlight }] : [];
  rows.push({ type: 'genreFilter', id: 'genre-filter' });

  const contentStart = rows.length;
  feed.categories.forEach((category, categoryIndex) => {
    const railRows = category.rails.flatMap((rail): HomeRow[] => {
      const railSeries = rail.seriesIds
        .map((id) => seriesById.get(id))
        .filter((item): item is Series => item !== undefined && matchesGenre(item, genre));
      return railSeries.length > 0
        ? [{ type: 'rail', id: rail.id, title: rail.title, series: railSeries }]
        : [];
    });
    if (railRows.length > 0) {
      rows.push({
        type: 'category',
        id: category.id,
        title: category.title,
        highlighted: categoryIndex === 0,
      });
      rows.push(...railRows);
    }
  });

  if (rows.length === contentStart) {
    rows.push({ type: 'empty', id: 'empty' });
  }
  return rows;
}

function getResultRowHeight(row: HomeRow): number {
  switch (row.type) {
    case 'hero':
    case 'genreFilter':
      return 0;
    case 'category':
      return CATEGORY_ROW_HEIGHT;
    case 'rail':
      return RAIL_ROW_HEIGHT;
    case 'empty':
      return EMPTY_ROW_HEIGHT;
    default: {
      const _exhaustive: never = row;
      return _exhaustive;
    }
  }
}

/**
 * Footer height that keeps the list long enough for the genre bar to stay pinned when a filter
 * leaves few results, so the hero doesn't slide back into view.
 */
export function getFooterHeight(
  rows: readonly HomeRow[],
  viewportHeight: number,
  bottomPadding: number,
): number {
  const resultsHeight = rows.reduce((sum, row) => sum + getResultRowHeight(row), 0);
  return Math.max(bottomPadding, viewportHeight - GENRE_BAR_HEIGHT - resultsHeight);
}
