import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { createStore, Provider } from 'jotai';
import type { ComponentProps, ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { makeEpisode } from '@/domain/__tests__/fixtures';

import { EpisodeSlide } from '../EpisodeSlide';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useIsFocused: () => true,
}));

type SlideProps = Partial<ComponentProps<typeof EpisodeSlide>>;

const handlers = {
  onPlay: jest.fn(),
  onTogglePause: jest.fn(),
  onFinished: jest.fn(),
};

async function renderSlide(props: SlideProps = {}) {
  const store = createStore();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <GestureHandlerRootView>
        <Provider store={store}>{children}</Provider>
      </GestureHandlerRootView>
    );
  }
  await render(
    <EpisodeSlide
      episode={makeEpisode(1)}
      seriesTitle="The Billionaire's Secret"
      height={800}
      isActive
      isWatchMode={false}
      isPaused={false}
      {...handlers}
      {...props}
    />,
    { wrapper: Wrapper },
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EpisodeSlide', () => {
  it('shows the info and Watch on an unlocked episode, with no lock or video', async () => {
    await renderSlide();

    expect(screen.getByRole('header', { name: "The Billionaire's Secret" })).toBeOnTheScreen();
    expect(screen.getByText('Ep 1')).toBeOnTheScreen();
    expect(screen.getByText('2:00')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Unlock Episode/ })).not.toBeOnTheScreen();
    expect(screen.queryByTestId('video-view')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Watch' }));
    expect(handlers.onPlay).toHaveBeenCalledTimes(1);
  });

  it('plays the active episode once started, and a tap pauses it', async () => {
    await renderSlide({ isWatchMode: true });

    expect(screen.getByTestId('video-view')).toBeOnTheScreen();

    await fireEvent(screen.getByRole('button', { name: 'Pause' }), 'accessibilityTap');
    expect(handlers.onTogglePause).toHaveBeenCalledTimes(1);
  });

  it('is already in watch mode before it becomes active: no video yet, but no Watch either', async () => {
    await renderSlide({ isWatchMode: true, isActive: false });

    expect(screen.queryByTestId('video-view')).not.toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Watch' })).not.toBeOnTheScreen();
  });

  it('keeps the video and brings Watch back on the episode that was paused', async () => {
    await renderSlide({ isPaused: true });

    expect(screen.getByTestId('video-view')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Watch' })).toBeOnTheScreen();
  });

  it('shows only the thumbnail and Watch on any other episode while paused', async () => {
    await renderSlide();

    expect(screen.queryByTestId('video-view')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Watch' })).toBeOnTheScreen();
  });

  it('locks a paid episode: no video, and the card and Watch both open unlock', async () => {
    await renderSlide({ episode: makeEpisode(5), isWatchMode: true });

    expect(screen.queryByTestId('video-view')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Unlock Episode 5' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Watch' }));

    expect(router.push).toHaveBeenCalledTimes(2);
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/unlock/[episodeId]',
      params: { episodeId: 's1-e5' },
    });
    expect(handlers.onPlay).not.toHaveBeenCalled();
  });

  it('toggles the like and shows the counts', async () => {
    await renderSlide();

    expect(screen.getByText('12K')).toBeOnTheScreen();
    expect(screen.getByText('342')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Like, 12000 likes' }));

    expect(screen.getByRole('button', { name: 'Remove like, 12001 likes' })).toBeSelected();
  });
});
