import { act, renderHook } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';

import { DEMO_CONFIG } from '@/config/demo';
import { type FakeVideoPlayer, fakePlayers } from '@/test/fakeExpoVideo';

import { useEpisodePlayer } from '../useEpisodePlayer';

jest.mock('expo-router', () => ({ useIsFocused: jest.fn(() => true) }));

function lastPlayer(): FakeVideoPlayer {
  const player = fakePlayers.at(-1);
  if (player === undefined) {
    throw new Error('No player was created');
  }
  return player;
}

async function renderPlayer(shouldPlay = true) {
  const onFinished = jest.fn();
  const view = await renderHook(
    (props: { shouldPlay: boolean }) =>
      useEpisodePlayer({ uri: 'https://example.com/a.m3u8', onFinished, ...props }),
    { initialProps: { shouldPlay } },
  );
  return { ...view, onFinished, player: lastPlayer() };
}

beforeEach(() => {
  jest.mocked(useIsFocused).mockReturnValue(true);
});

describe('useEpisodePlayer', () => {
  it('plays and pauses with shouldPlay', async () => {
    const { rerender, player } = await renderPlayer();
    expect(player.play).toHaveBeenCalledTimes(1);

    await rerender({ shouldPlay: false });
    expect(player.pause).toHaveBeenCalledTimes(1);
  });

  it('stays paused while the screen is not focused', async () => {
    jest.mocked(useIsFocused).mockReturnValue(false);

    const { player } = await renderPlayer();

    expect(player.play).not.toHaveBeenCalled();
    expect(player.pause).toHaveBeenCalled();
  });

  it('keeps going below the playback cap', async () => {
    const { player, onFinished } = await renderPlayer();

    await act(async () => {
      player.emit('timeUpdate', { currentTime: DEMO_CONFIG.playbackCapSec - 1 });
    });

    expect(onFinished).not.toHaveBeenCalled();
  });

  it('stops and rewinds at the playback cap', async () => {
    const { player, onFinished } = await renderPlayer();
    player.currentTime = DEMO_CONFIG.playbackCapSec;

    await act(async () => {
      player.emit('timeUpdate', { currentTime: DEMO_CONFIG.playbackCapSec });
    });

    expect(player.pause).toHaveBeenCalled();
    expect(player.seekBy).toHaveBeenCalledWith(-DEMO_CONFIG.playbackCapSec);
    expect(onFinished).toHaveBeenCalledTimes(1);
  });

  it('finishes when a video is shorter than the cap', async () => {
    const { player, onFinished } = await renderPlayer();

    await act(async () => player.emit('playToEnd'));

    expect(onFinished).toHaveBeenCalledTimes(1);
  });

  it('uses the video length when it is shorter than the cap', async () => {
    const { result, player } = await renderPlayer();
    expect(result.current.duration.get()).toBe(DEMO_CONFIG.playbackCapSec);

    await act(async () => player.emit('sourceLoad', { duration: 8 }));

    expect(result.current.duration.get()).toBe(8);
  });

  it('seeks forward and back, and stops at the start', async () => {
    const { result, player } = await renderPlayer();
    player.currentTime = 4;

    await act(async () => result.current.seekBy(5));
    expect(player.seekBy).toHaveBeenLastCalledWith(5);
    expect(result.current.currentTime.get()).toBe(9);

    await act(async () => result.current.seekBy(-10));
    expect(player.seekBy).toHaveBeenLastCalledWith(-4);
    expect(result.current.currentTime.get()).toBe(0);
  });

  it('finishes the episode when a seek goes past the end', async () => {
    const { result, player, onFinished } = await renderPlayer();
    player.currentTime = DEMO_CONFIG.playbackCapSec - 5;

    await act(async () => result.current.seekBy(10));

    expect(onFinished).toHaveBeenCalledTimes(1);
    expect(result.current.currentTime.get()).toBe(0);
  });

  it('holds playback during a scrub and jumps to the chosen time', async () => {
    const { result, player } = await renderPlayer();
    player.currentTime = 2;
    player.play.mockClear();

    await act(async () => result.current.startScrub());
    expect(player.pause).toHaveBeenCalled();

    await act(async () => result.current.endScrub(7));
    expect(player.seekBy).toHaveBeenCalledWith(5);
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('resumes without seeking when a scrub is cancelled', async () => {
    const { result, player } = await renderPlayer();

    await act(async () => result.current.startScrub());
    await act(async () => result.current.endScrub());

    expect(player.seekBy).not.toHaveBeenCalled();
  });

  it('reports a failed stream', async () => {
    const { result, player } = await renderPlayer();
    expect(result.current.hasFailed).toBe(false);

    await act(async () => player.emit('statusChange', { status: 'error' }));

    expect(result.current.hasFailed).toBe(true);
  });
});
