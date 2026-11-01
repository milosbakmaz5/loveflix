import type { MembershipPlan, UnlockOption } from '@/domain';

import { getSheetOptions } from '../getSheetOptions';

const money = { amountMinor: 999, currency: 'EUR' } as const;
const monthly: MembershipPlan = { id: 'monthly', price: money, period: 'month' };
const weekly: MembershipPlan = { id: 'weekly', price: money, period: 'week' };

const episode: UnlockOption = { type: 'episode', episodeId: 'e5', cost: 20 };
const season: UnlockOption = {
  type: 'season',
  seriesId: 's1',
  fromEpisode: 5,
  toEpisode: 6,
  episodeIds: ['e5', 'e6'],
  cost: 24,
};

describe('getSheetOptions', () => {
  it('keeps the episode, the season and the monthly plan, in order', () => {
    const options = getSheetOptions([
      episode,
      season,
      { type: 'membership', plan: weekly },
      { type: 'membership', plan: monthly },
      { type: 'ad', episodeId: 'e5' },
    ]);

    expect(options).toEqual([episode, season, { type: 'membership', plan: monthly }]);
  });

  it('drops a season that would only cover one episode', () => {
    const lastEpisode = { ...season, toEpisode: 5, episodeIds: ['e5'] };

    expect(getSheetOptions([episode, lastEpisode])).toEqual([episode]);
  });
});
