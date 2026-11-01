import type { Genre, Series } from '@/domain';

import { getRelatedSeries } from '../getRelatedSeries';

function makeSeries(id: string, genres: readonly Genre[]): Series {
  const image = { uri: 'https://example.com/image.jpg' };
  return {
    id,
    title: id,
    tagline: '',
    synopsis: '',
    genres,
    tags: [],
    rating: 4,
    ratingCount: 1,
    year: 2024,
    episodeCount: 10,
    minutesPerEpisode: 2,
    isPro: false,
    posterImage: image,
    heroImage: image,
    cast: [],
    highlights: [],
  };
}

const current = makeSeries('current', ['romance', 'drama']);

describe('getRelatedSeries', () => {
  it('leaves out the series itself and those with no genre in common', () => {
    const catalog = [current, makeSeries('match', ['drama']), makeSeries('other', ['action'])];

    expect(getRelatedSeries(current, catalog).map(({ id }) => id)).toEqual(['match']);
  });

  it('puts the closest match first', () => {
    const catalog = [makeSeries('one', ['drama']), makeSeries('two', ['romance', 'drama'])];

    expect(getRelatedSeries(current, catalog).map(({ id }) => id)).toEqual(['two', 'one']);
  });

  it('keeps the rail short', () => {
    const catalog = Array.from({ length: 12 }, (_, i) => makeSeries(`s${i}`, ['drama']));

    expect(getRelatedSeries(current, catalog)).toHaveLength(8);
  });
});
