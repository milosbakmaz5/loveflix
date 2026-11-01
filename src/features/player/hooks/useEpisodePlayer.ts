import { useEvent, useEventListener } from 'expo';
import { useIsFocused } from 'expo-router';
import { useVideoPlayer, type VideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';

import { getPlayableDuration } from '../utils/playbackTime';

export const TIME_UPDATE_INTERVAL_SEC = 0.25;

type EpisodePlayerOptions = {
  uri: string;
  shouldPlay: boolean;
  onFinished: () => void;
};

type EpisodePlayerState = {
  player: VideoPlayer;
  hasFailed: boolean;
  currentTime: SharedValue<number>;
  duration: SharedValue<number>;
  /** Positive to go forward. Going past the end finishes the episode. */
  seekBy: (seconds: number) => void;
  startScrub: () => void;
  /** Without a time the scrub was cancelled and playback carries on where it was. */
  endScrub: (time?: number) => void;
};

/** Owns one player: released on unmount, paused off-screen, stopped at the demo playback cap. */
export function useEpisodePlayer({
  uri,
  shouldPlay,
  onFinished,
}: EpisodePlayerOptions): EpisodePlayerState {
  const player = useVideoPlayer(uri, (created) => {
    created.timeUpdateEventInterval = TIME_UPDATE_INTERVAL_SEC;
  });
  const isFocused = useIsFocused();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const isRunning = shouldPlay && isFocused && !isScrubbing;
  const currentTime = useSharedValue(0);
  const duration = useSharedValue(getPlayableDuration(0));
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    if (isRunning) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isRunning]);

  function finish() {
    player.pause();
    // Watching the last episode again starts it from the beginning.
    player.seekBy(-player.currentTime);
    currentTime.set(0);
    onFinished();
  }

  function seekTo(time: number) {
    if (time >= duration.get()) {
      finish();
      return;
    }
    const target = Math.max(time, 0);
    player.seekBy(target - player.currentTime);
    currentTime.set(target);
  }

  useEventListener(player, 'sourceLoad', (source) => {
    duration.set(getPlayableDuration(source.duration));
  });
  useEventListener(player, 'timeUpdate', (update) => {
    if (update.currentTime >= duration.get()) {
      finish();
    } else {
      currentTime.set(update.currentTime);
    }
  });
  useEventListener(player, 'playToEnd', finish);

  return {
    player,
    hasFailed: status === 'error',
    currentTime,
    duration,
    seekBy: (seconds) => seekTo(player.currentTime + seconds),
    startScrub: () => setIsScrubbing(true),
    endScrub: (time) => {
      if (time !== undefined) {
        seekTo(time);
      }
      setIsScrubbing(false);
    },
  };
}
