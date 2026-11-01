import { fireEvent, render, screen } from '@testing-library/react-native';

import type { CoinPack } from '@/domain';

import { CoinPackCard } from '../CoinPackCard';

const pack: CoinPack = {
  id: 'coins-800',
  coins: 800,
  bonusCoins: 50,
  price: { amountMinor: 699, currency: 'EUR' },
  badge: 'popular',
};

describe('CoinPackCard', () => {
  it('shows the coins, bonus, price and banner', async () => {
    await render(<CoinPackCard pack={pack} isSelected={false} onSelect={jest.fn()} />);

    expect(screen.getByText('800')).toBeOnTheScreen();
    expect(screen.getByText('+ 50 Bonus')).toBeOnTheScreen();
    expect(screen.getByText('€6.99')).toBeOnTheScreen();
    expect(screen.getByText('Popular')).toBeOnTheScreen();
  });

  it('has no bonus or banner on a plain pack', async () => {
    const plain: CoinPack = { ...pack, bonusCoins: 0, badge: undefined };
    await render(<CoinPackCard pack={plain} isSelected={false} onSelect={jest.fn()} />);

    expect(screen.queryByText(/Bonus/)).not.toBeOnTheScreen();
    expect(screen.queryByText('Popular')).not.toBeOnTheScreen();
  });

  it('reports selection and selects on press', async () => {
    const onSelect = jest.fn();
    await render(<CoinPackCard pack={pack} isSelected onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole('radio', { selected: true, name: /800 Coins/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
