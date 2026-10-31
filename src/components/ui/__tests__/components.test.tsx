import { fireEvent, render, screen } from '@testing-library/react-native';
import { Heart, Play } from 'lucide-react-native';

import { RepositoryError } from '@/data';
import type { Series } from '@/domain';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  CoinAmount,
  ErrorState,
  IconButton,
  PosterCard,
} from '..';
import { getInitials } from '../Avatar';

const series: Series = {
  id: 'billionaires-secret',
  title: "The Billionaire's Secret",
  tagline: 'A secret contract.',
  synopsis: '',
  genres: ['romance'],
  tags: [],
  rating: 4.8,
  ratingCount: 12000,
  year: 2024,
  episodeCount: 45,
  minutesPerEpisode: 1.5,
  isPro: true,
  posterImage: { uri: 'https://example.com/poster.jpg' },
  heroImage: { uri: 'https://example.com/hero.jpg' },
  cast: [],
  highlights: [],
};

describe('Button', () => {
  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Watch now" icon={Play} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Watch now' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Watch" disabled onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Watch' });
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reports busy and blocks presses while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Buy" loading onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Buy' });
    expect(button).toBeBusy();
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('includes the sublabel in its accessible name', async () => {
    await render(
      <Button label="Buy 800 Coins" sublabel="for €6.99" variant="premium" onPress={jest.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Buy 800 Coins, for €6.99' })).toBeOnTheScreen();
  });
});

describe('IconButton', () => {
  it('is announced by its label and reports selection', async () => {
    const onPress = jest.fn();
    await render(<IconButton icon={Heart} accessibilityLabel="Like" selected onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Like' });
    expect(button).toBeSelected();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalled();
  });
});

describe('Chip', () => {
  it('reports its selected state', async () => {
    await render(
      <>
        <Chip label="All" selected onPress={jest.fn()} />
        <Chip label="Drama" selected={false} onPress={jest.fn()} />
      </>,
    );

    expect(screen.getByRole('button', { name: 'All' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Drama' })).not.toBeSelected();
  });
});

describe('Card', () => {
  it('acts as a radio option when given that role', async () => {
    const onPress = jest.fn();
    await render(
      <Card
        selected
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityLabel="Unlock Episode"
      >
        <></>
      </Card>,
    );

    const option = screen.getByRole('radio', { name: 'Unlock Episode' });
    expect(option).toBeSelected();
    await fireEvent.press(option);
    expect(onPress).toHaveBeenCalled();
  });
});

describe('Badge', () => {
  it.each([
    ['pro', 'Pro'],
    ['spotlight', 'Spotlight'],
    ['popular', 'Popular'],
    ['bestValue', 'Best value'],
    ['locked', 'Locked'],
  ] as const)('%s shows its translated label', async (variant, label) => {
    await render(<Badge variant={variant} />);
    expect(screen.getByText(label)).toBeOnTheScreen();
  });
});

describe('CoinAmount', () => {
  it('pluralises', async () => {
    await render(
      <>
        <CoinAmount amount={1} />
        <CoinAmount amount={15} />
      </>,
    );
    expect(screen.getByText('1 Coin')).toBeOnTheScreen();
    expect(screen.getByText('15 Coins')).toBeOnTheScreen();
  });
});

describe('PosterCard', () => {
  it('describes the series for screen readers and passes it on press', async () => {
    const onPress = jest.fn();
    await render(<PosterCard series={series} onPress={onPress} />);

    const card = screen.getByRole('button', {
      name: "The Billionaire's Secret, 45 episodes, premium",
    });
    expect(screen.getByText('45 Eps')).toBeOnTheScreen();
    expect(screen.getByText('1.5m/ep')).toBeOnTheScreen();
    await fireEvent.press(card);
    expect(onPress).toHaveBeenCalledWith(series);
  });

  it('shows no PRO badge for free series', async () => {
    await render(<PosterCard series={{ ...series, isPro: false }} onPress={jest.fn()} />);
    expect(screen.queryByText('Pro')).not.toBeOnTheScreen();
  });
});

describe('ErrorState', () => {
  it('offers a retry for network errors', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState error={new RepositoryError('network', 'x')} onRetry={onRetry} />);

    expect(screen.getByText(/Couldn't load this/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('says not found, without a pointless retry', async () => {
    await render(<ErrorState error={new RepositoryError('notFound', 'x')} onRetry={jest.fn()} />);

    expect(screen.getByText(/isn't available/)).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeOnTheScreen();
  });

  it('treats unknown errors as load failures', async () => {
    await render(<ErrorState error={new Error('boom')} />);
    expect(screen.getByText(/Couldn't load this/)).toBeOnTheScreen();
  });
});

describe('Avatar', () => {
  it('shows initials when there is no photo', async () => {
    await render(<Avatar name="Alexander Sterling" />);
    expect(screen.getByText('AS')).toBeOnTheScreen();
    expect(screen.getByLabelText('Alexander Sterling')).toBeOnTheScreen();
  });

  it('shows the photo when there is one', async () => {
    await render(<Avatar name="Sarah Connor" image={{ uri: 'https://example.com/a.jpg' }} />);
    expect(screen.queryByText('SC')).not.toBeOnTheScreen();
    expect(screen.getByLabelText('Sarah Connor')).toBeOnTheScreen();
  });

  it.each([
    ['Alexander Sterling', 'AS'],
    ['Cher', 'C'],
    ['  mary  ann   lee ', 'ML'],
    ['', ''],
  ])('initials of %p are %p', (name, initials) => {
    expect(getInitials(name)).toBe(initials);
  });
});
