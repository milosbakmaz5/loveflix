import { makeEpisode } from '@/domain/__tests__/fixtures';

import { getInitialEpisodeIndex } from '../getInitialEpisodeIndex';

const episodes = [makeEpisode(1), makeEpisode(2), makeEpisode(3)];

describe('getInitialEpisodeIndex', () => {
  it('finds the episode number from the route param', () => {
    expect(getInitialEpisodeIndex(episodes, '3')).toBe(2);
  });

  it.each([[undefined], ['99'], ['abc']])('falls back to the first episode for %s', (param) => {
    expect(getInitialEpisodeIndex(episodes, param)).toBe(0);
  });
});
