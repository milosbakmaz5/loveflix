import { fireEvent, render, screen } from '@testing-library/react-native';

import type { UnlockOption } from '@/domain';

import { UnlockOptionRow } from '../UnlockOptionRow';

const season: UnlockOption = {
  type: 'season',
  seriesId: 's1',
  fromEpisode: 12,
  toEpisode: 45,
  episodeIds: ['e12', 'e13'],
  cost: 150,
};

describe('UnlockOptionRow', () => {
  it('shows the season range, its price and the Best value badge', async () => {
    await render(<UnlockOptionRow option={season} isSelected onSelect={jest.fn()} />);

    expect(screen.getByText('Episodes 12 - 45')).toBeOnTheScreen();
    expect(screen.getByText('150 Coins')).toBeOnTheScreen();
    expect(screen.getByText('Best value')).toBeOnTheScreen();
    expect(screen.getByRole('radio', { selected: true })).toBeOnTheScreen();
  });

  it('has no badge on the single episode', async () => {
    const episode: UnlockOption = { type: 'episode', episodeId: 'e5', cost: 20 };
    await render(<UnlockOptionRow option={episode} isSelected={false} onSelect={jest.fn()} />);

    expect(screen.getByText('20 Coins')).toBeOnTheScreen();
    expect(screen.queryByText('Best value')).not.toBeOnTheScreen();
  });

  it('shows the membership price per period', async () => {
    const membership: UnlockOption = {
      type: 'membership',
      plan: { id: 'm', price: { amountMinor: 999, currency: 'EUR' }, period: 'month' },
    };
    await render(<UnlockOptionRow option={membership} isSelected={false} onSelect={jest.fn()} />);

    expect(screen.getByText('€9.99/mo')).toBeOnTheScreen();
  });

  it('selects on press', async () => {
    const onSelect = jest.fn();
    await render(<UnlockOptionRow option={season} isSelected={false} onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole('radio', { name: /Unlock Full Season/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
