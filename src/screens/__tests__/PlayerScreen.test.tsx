import { fireEvent, render, screen } from '@testing-library/react-native';

import { createMockRepositories, RepositoryError } from '@/data';
import { createTestWrapper } from '@/test/queryTestUtils';

import { PlayerScreen } from '../PlayerScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useIsFocused: () => true,
}));

const SERIES_ID = 'billionaires-secret';

async function renderPlayer(
  repositories = createMockRepositories({ latencyMs: 0 }),
  episodeParam?: string,
) {
  await render(<PlayerScreen seriesId={SERIES_ID} episodeParam={episodeParam} />, {
    wrapper: createTestWrapper({ repositories }),
  });
}

describe('PlayerScreen', () => {
  it('opens on the first episode with a back button', async () => {
    await renderPlayer();

    expect(await screen.findByText('Ep 1')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
  });

  it('opens the locked episode from the route param', async () => {
    await renderPlayer(undefined, '5');

    expect(await screen.findByRole('button', { name: 'Unlock Episode 5' })).toBeOnTheScreen();
  });

  it('shows the empty state when the series has no episodes', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    jest.spyOn(repositories.catalog, 'getEpisodes').mockResolvedValue([]);
    await renderPlayer(repositories);

    expect(await screen.findByText('Nothing here yet.')).toBeOnTheScreen();
  });

  it('shows an error with Retry, and Retry loads the episodes', async () => {
    const repositories = createMockRepositories({ latencyMs: 0 });
    const getEpisodes = repositories.catalog.getEpisodes;
    jest
      .spyOn(repositories.catalog, 'getEpisodes')
      .mockRejectedValueOnce(new RepositoryError('network', 'offline'))
      .mockImplementation(getEpisodes);
    await renderPlayer(repositories);

    await fireEvent.press(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Ep 1')).toBeOnTheScreen();
  });
});
