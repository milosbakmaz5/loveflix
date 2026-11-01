import { DEMO_CONFIG } from '@/config/demo';

export const SEEK_STEP_SEC = 10;

/** How much of a video can be watched: its length, cut off at the demo playback cap. */
export function getPlayableDuration(videoDuration: number): number {
  return videoDuration > 0
    ? Math.min(videoDuration, DEMO_CONFIG.playbackCapSec)
    : DEMO_CONFIG.playbackCapSec;
}

/** Time under a finger at `x` on a track `trackWidth` wide, kept inside the video. */
export function getTimeAtPosition(x: number, trackWidth: number, duration: number): number {
  'worklet';
  if (trackWidth <= 0) {
    return 0;
  }
  return Math.min(Math.max(x / trackWidth, 0), 1) * duration;
}
