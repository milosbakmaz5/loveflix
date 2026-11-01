import { useState } from 'react';
import { View } from 'react-native';

type Listener = (payload: unknown) => void;

export type FakeVideoPlayer = {
  status: string;
  currentTime: number;
  duration: number;
  timeUpdateEventInterval: number;
  play: jest.Mock;
  pause: jest.Mock;
  seekBy: jest.Mock;
  addListener: (event: string, listener: Listener) => { remove: () => void };
  emit: (event: string, payload?: unknown) => void;
};

/** Every player created so far; the newest is the one on screen. */
export const fakePlayers: FakeVideoPlayer[] = [];

function createFakePlayer(): FakeVideoPlayer {
  const listeners = new Map<string, Set<Listener>>();
  const player: FakeVideoPlayer = {
    status: 'readyToPlay',
    currentTime: 0,
    duration: 0,
    timeUpdateEventInterval: 0,
    play: jest.fn(),
    pause: jest.fn(),
    seekBy: jest.fn(),
    addListener(event, listener) {
      const forEvent = listeners.get(event) ?? new Set<Listener>();
      forEvent.add(listener);
      listeners.set(event, forEvent);
      return { remove: () => forEvent.delete(listener) };
    },
    emit(event, payload) {
      listeners.get(event)?.forEach((listener) => listener(payload));
    },
  };
  fakePlayers.push(player);
  return player;
}

export function useVideoPlayer(
  _source: unknown,
  setup?: (player: FakeVideoPlayer) => void,
): FakeVideoPlayer {
  const [player] = useState(() => {
    const created = createFakePlayer();
    setup?.(created);
    return created;
  });
  return player;
}

export function VideoView() {
  return <View testID="video-view" />;
}
