import type { HomeFeed, Series } from '@/domain';

import {
  buildHomeRows,
  CATEGORY_ROW_HEIGHT,
  EMPTY_ROW_HEIGHT,
  GENRE_BAR_HEIGHT,
  getFooterHeight,
  type HomeRow,
  RAIL_ROW_HEIGHT,
} from '../homeRows';

const IMAGE = { uri: 'https://example.com/image.jpg' };

function makeSeries(id: string, genres: Series['genres']): Series {
  return {
    id,
    title: id,
    tagline: '',
    synopsis: '',
    genres,
    tags: [],
    rating: 4.5,
    ratingCount: 10,
    year: 2024,
    episodeCount: 10,
    minutesPerEpisode: 2,
    isPro: false,
    posterImage: IMAGE,
    heroImage: IMAGE,
    cast: [],
    highlights: [],
  };
}

const series = [
  makeSeries('spot', ['drama']),
  makeSeries('a', ['romance']),
  makeSeries('b', ['romance', 'drama']),
  makeSeries('c', ['action']),
];

const feed: HomeFeed = {
  spotlightSeriesId: 'spot',
  genres: ['romance', 'drama', 'action', 'fantasy'],
  categories: [
    {
      id: 'first',
      title: 'First',
      rails: [
        { id: 'r1', title: 'Rail 1', seriesIds: ['a', 'b', 'missing'] },
        { id: 'r2', title: 'Rail 2', seriesIds: ['a'] },
      ],
    },
    { id: 'second', title: 'Second', rails: [{ id: 'r3', title: 'Rail 3', seriesIds: ['c'] }] },
  ],
};

function ids(rows: readonly HomeRow[]) {
  return rows.map((row) => row.id);
}

describe('buildHomeRows', () => {
  it('starts with the hero and the genre bar, then the feed in order', () => {
    expect(ids(buildHomeRows(feed, series, 'all'))).toEqual([
      'hero',
      'genre-filter',
      'first',
      'r1',
      'r2',
      'second',
      'r3',
    ]);
  });

  it('highlights only the first category of the feed', () => {
    const categories = buildHomeRows(feed, series, 'all').filter((row) => row.type === 'category');
    expect(categories.map((row) => row.highlighted)).toEqual([true, false]);
  });

  it('skips ids missing from the series list', () => {
    const rail = buildHomeRows(feed, series, 'all').find((row) => row.id === 'r1');
    expect(rail?.type === 'rail' && rail.series.map((s) => s.id)).toEqual(['a', 'b']);
  });

  it('drops series, rails and categories the genre filter empties', () => {
    expect(ids(buildHomeRows(feed, series, 'drama'))).toEqual([
      'hero',
      'genre-filter',
      'first',
      'r1',
    ]);
    const rail = buildHomeRows(feed, series, 'drama').find((row) => row.id === 'r1');
    expect(rail?.type === 'rail' && rail.series.map((s) => s.id)).toEqual(['b']);
  });

  it('keeps a category highlighted by its feed position, not by what remains', () => {
    const rows = buildHomeRows(feed, series, 'action');
    const second = rows.find((row) => row.id === 'second');
    expect(second?.type === 'category' && second.highlighted).toBe(false);
  });

  it('keeps the hero and bar and adds an empty row when nothing matches', () => {
    expect(ids(buildHomeRows(feed, series, 'fantasy'))).toEqual(['hero', 'genre-filter', 'empty']);
  });

  it('leaves out the hero when the spotlight series is missing', () => {
    const rows = buildHomeRows({ ...feed, spotlightSeriesId: 'missing' }, series, 'all');
    expect(rows[0]?.type).toBe('genreFilter');
  });
});

describe('getFooterHeight', () => {
  const PADDING = 24;

  it('is just the bottom padding when the results are long', () => {
    expect(getFooterHeight(buildHomeRows(feed, series, 'all'), 800, PADDING)).toBe(PADDING);
  });

  it('fills the viewport below the bar when the results are short', () => {
    const rows = buildHomeRows(feed, series, 'action');
    expect(getFooterHeight(rows, 800, PADDING)).toBe(
      800 - GENRE_BAR_HEIGHT - CATEGORY_ROW_HEIGHT - RAIL_ROW_HEIGHT,
    );
  });

  it('counts the empty row too', () => {
    const rows = buildHomeRows(feed, series, 'fantasy');
    expect(getFooterHeight(rows, 800, PADDING)).toBe(800 - GENRE_BAR_HEIGHT - EMPTY_ROW_HEIGHT);
  });
});
