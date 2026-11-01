import { parseCoinOptionType } from '../parseCoinOptionType';

describe('parseCoinOptionType', () => {
  it('keeps the season', () => {
    expect(parseCoinOptionType('season')).toBe('season');
  });

  it.each([['episode'], ['membership'], ['nonsense'], [undefined]])(
    'treats %s as the single episode',
    (param) => {
      expect(parseCoinOptionType(param)).toBe('episode');
    },
  );
});
