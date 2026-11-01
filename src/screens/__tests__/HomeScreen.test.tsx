import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { createMockRepositories, RepositoryError } from '@/data';
import { createTestWrapper } from '@/test/queryTestUtils';

import { HomeScreen } from '../HomeScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), navigate: jest.fn(), back: jest.fn() },
}));

async function renderHome(repositories = createMockRepositories({ latencyMs: 0 })) {
  await render(<HomeScreen />, { wrapper: createTestWrapper({ repositories }) });
  await screen.findByRole('header', { name: 'Echoes of Eternity' });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HomeScreen', () => {
  it('shows the spotlight, the genre bar, category headings and rails', async () => {
    await renderHome();

    expect(screen.getByRole('button', { name: 'All' })).toBeSelected();
    expect(screen.getByRole('header', { name: 'Romance' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Trending Romance' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: "The Billionaire's Secret, 45 episodes" }),
    ).toBeOnTheScreen();
  });

  it('filters the rails by genre and keeps the hero', async () => {
    await renderHome();

    await fireEvent.press(screen.getByRole('button', { name: 'Action' }));

    expect(await screen.findByRole('button', { name: /^Avenging Angel/ })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Action' })).toBeSelected();
    expect(screen.queryByRole('header', { name: 'Trending Romance' })).not.toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Echoes of Eternity' })).toBeOnTheScreen();
  });

  it('opens the player from Watch now and from a poster', async () => {
    await renderHome();

    await fireEvent.press(screen.getByRole('button', { name: 'Watch now' }));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/watch/[seriesId]',
      params: { seriesId: 'echoes-of-eternity' },
    });

    await fireEvent.press(
      screen.getByRole('button', { name: "The Billionaire's Secret, 45 episodes" }),
    );
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/watch/[seriesId]',
      params: { seriesId: 'billionaires-secret' },
    });
  });

  it('toggles the My List button label', async () => {
    await renderHome();

    await fireEvent.press(screen.getByRole('button', { name: 'Add to My List' }));
    expect(screen.getByRole('button', { name: 'Remove from My List' })).toBeOnTheScreen();
  });

  it('opens the Profile tab from the avatar', async () => {
    await renderHome();

    await fireEvent.press(await screen.findByRole('button', { name: 'Profile' }));
    expect(router.navigate).toHaveBeenCalledWith('/profile');
  });

  it('shows an error with Retry, and Retry loads the feed', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getHomeFeed = repositories.catalog.getHomeFeed;
    jest
      .spyOn(repositories.catalog, 'getHomeFeed')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(getHomeFeed);
    await render(<HomeScreen />, { wrapper: createTestWrapper({ repositories }) });

    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));

    await waitFor(() =>
      expect(screen.getByRole('header', { name: 'Echoes of Eternity' })).toBeOnTheScreen(),
    );
  });
});
