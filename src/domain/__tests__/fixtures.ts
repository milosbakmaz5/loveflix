import type { CoinPack, Entitlements, Episode, MembershipPlan } from '@/domain';

const IMAGE = { uri: 'https://example.com/image.jpg' };

export function makeEpisode(number: number, overrides: Partial<Episode> = {}): Episode {
  return {
    id: `s1-e${number}`,
    seriesId: 's1',
    number,
    title: `Episode ${number}`,
    durationSec: 120,
    thumbnail: IMAGE,
    videoUri: 'https://example.com/video.m3u8',
    access: number <= 4 ? { type: 'free' } : { type: 'coins', price: 20 },
    ...overrides,
  };
}

/** Episodes 1–4 free, 5–10 cost 20 coins each. */
export const season = Array.from({ length: 10 }, (_, index) => makeEpisode(index + 1));

export function entitlements(
  unlocked: readonly string[] = [],
  membership: Entitlements['membership'] = { status: 'none' },
): Entitlements {
  return { unlockedEpisodeIds: new Set(unlocked), membership };
}

export const packs: readonly CoinPack[] = [
  { id: 'p800', coins: 800, bonusCoins: 50, price: { amountMinor: 699, currency: 'EUR' } },
  { id: 'p300', coins: 300, bonusCoins: 0, price: { amountMinor: 299, currency: 'EUR' } },
  { id: 'p2500', coins: 2500, bonusCoins: 200, price: { amountMinor: 1999, currency: 'EUR' } },
];

export const monthlyPlan: MembershipPlan = {
  id: 'premium-monthly',
  price: { amountMinor: 999, currency: 'USD' },
  period: 'month',
};
