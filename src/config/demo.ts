// Tunable demo behaviour. Chosen so the whole unlock flow is visible in one run:
// episode 4 ends on the cliffhanger, the first unlock fails for lack of coins,
// and buying any pack makes it succeed.
export const DEMO_CONFIG = {
  /** Episodes 1..N of every series are free. */
  freeEpisodeCount: 4,
  /** Coin price of every paid episode. */
  episodePriceCoins: 20,
  /** Balance on first launch. */
  startingCoinBalance: 15,
  /** "Unlock full season" discount (0.4 = 40% off). */
  seasonDiscountRate: 0.4,
  /** Each episode stops after this many seconds so the cliffhanger arrives quickly. */
  playbackCapSec: 60,
  /** How long the mock rewarded ad runs before it unlocks the episode. */
  adDurationSec: 5,
  /** Simulated network latency of the mock repository. */
  mockLatencyMs: 300,
} as const;
