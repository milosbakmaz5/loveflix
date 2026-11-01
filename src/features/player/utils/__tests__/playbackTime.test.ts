import { DEMO_CONFIG } from '@/config/demo';

import { getPlayableDuration, getTimeAtPosition } from '../playbackTime';

describe('getPlayableDuration', () => {
  it('cuts long videos off at the demo cap', () => {
    expect(getPlayableDuration(600)).toBe(DEMO_CONFIG.playbackCapSec);
  });

  it('keeps videos shorter than the cap', () => {
    expect(getPlayableDuration(8)).toBe(8);
  });

  it('uses the cap until the length is known', () => {
    expect(getPlayableDuration(0)).toBe(DEMO_CONFIG.playbackCapSec);
  });
});

describe('getTimeAtPosition', () => {
  it('maps a position on the track to a time', () => {
    expect(getTimeAtPosition(150, 300, 10)).toBe(5);
  });

  it('stays inside the video when the finger leaves the track', () => {
    expect(getTimeAtPosition(-20, 300, 10)).toBe(0);
    expect(getTimeAtPosition(400, 300, 10)).toBe(10);
  });

  it('is 0 before the track is measured', () => {
    expect(getTimeAtPosition(100, 0, 10)).toBe(0);
  });
});
