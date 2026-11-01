import { season } from '@/domain/__tests__/fixtures';

import { COLLAPSED_EPISODE_COUNT, getVisibleEpisodes } from '../getVisibleEpisodes';

function numbers(episodes: readonly { number: number }[]) {
  return episodes.map((episode) => episode.number);
}

describe('getVisibleEpisodes', () => {
  it('shows the first few while collapsed', () => {
    expect(getVisibleEpisodes(season, 'firstToLast', false)).toHaveLength(COLLAPSED_EPISODE_COUNT);
    expect(numbers(getVisibleEpisodes(season, 'firstToLast', false))[0]).toBe(1);
  });

  it('shows all once expanded', () => {
    expect(getVisibleEpisodes(season, 'firstToLast', true)).toHaveLength(season.length);
  });

  it('starts from the last episode when reversed, collapsed or not', () => {
    expect(numbers(getVisibleEpisodes(season, 'lastToFirst', false))[0]).toBe(10);
    expect(numbers(getVisibleEpisodes(season, 'lastToFirst', true)).at(-1)).toBe(1);
  });

  it('does not change the input', () => {
    const before = numbers(season);

    getVisibleEpisodes(season, 'lastToFirst', true);

    expect(numbers(season)).toEqual(before);
  });
});
