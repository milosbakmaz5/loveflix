import type { CoinPack } from './models';

type SpendResult =
  { ok: true; balance: number } | { ok: false; reason: 'insufficient_coins'; missingCoins: number };

function assertCoinAmount(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer, got ${value}`);
  }
}

/** Coins credited for a pack, including the bonus. */
export function totalCoins(pack: CoinPack): number {
  return pack.coins + pack.bonusCoins;
}

export function canAfford(balance: number, cost: number): boolean {
  return balance >= cost;
}

export function getMissingCoins(balance: number, cost: number): number {
  return Math.max(0, cost - balance);
}

/** Deducts coins. Never lets the balance go negative. */
export function spendCoins(balance: number, cost: number): SpendResult {
  assertCoinAmount(balance, 'balance');
  assertCoinAmount(cost, 'cost');
  if (!canAfford(balance, cost)) {
    return {
      ok: false,
      reason: 'insufficient_coins',
      missingCoins: getMissingCoins(balance, cost),
    };
  }
  return { ok: true, balance: balance - cost };
}

/**
 * The cheapest pack that covers the missing coins — used to suggest a pack
 * when the user can't afford an unlock. Falls back to the largest pack.
 */
export function findPackCovering(
  packs: readonly CoinPack[],
  missingCoins: number,
): CoinPack | undefined {
  const byTotal = [...packs].sort((a, b) => totalCoins(a) - totalCoins(b));
  return byTotal.find((pack) => totalCoins(pack) >= missingCoins) ?? byTotal.at(-1);
}
