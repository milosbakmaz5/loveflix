import type { CoinPack, MembershipPlan } from '@/domain';

// Prices from the coin store design (1:970). Euros everywhere for consistency.
export const coinPacks: readonly CoinPack[] = [
  { id: 'coins-300', coins: 300, bonusCoins: 0, price: { amountMinor: 299, currency: 'EUR' } },
  {
    id: 'coins-800',
    coins: 800,
    bonusCoins: 50,
    price: { amountMinor: 699, currency: 'EUR' },
    badge: 'popular',
  },
  { id: 'coins-2500', coins: 2500, bonusCoins: 200, price: { amountMinor: 1999, currency: 'EUR' } },
  {
    id: 'coins-6000',
    coins: 6000,
    bonusCoins: 1000,
    price: { amountMinor: 4999, currency: 'EUR' },
    badge: 'bestValue',
  },
];

export const membershipPlans: readonly MembershipPlan[] = [
  { id: 'premium-monthly', price: { amountMinor: 999, currency: 'EUR' }, period: 'month' },
  { id: 'vip-weekly', price: { amountMinor: 499, currency: 'EUR' }, period: 'week' },
];
