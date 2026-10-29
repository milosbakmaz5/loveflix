import {
  canAfford,
  findPackCovering,
  getMissingCoins,
  spendCoins,
  topUp,
  totalCoins,
} from '@/domain';

import { packs } from './fixtures';

const p300 = packs[1]!;
const p800 = packs[0]!;
const p2500 = packs[2]!;

describe('totalCoins / topUp', () => {
  it('includes the bonus coins', () => {
    expect(totalCoins(p800)).toBe(850);
    expect(topUp(15, p800)).toBe(865);
  });

  it('rejects an invalid starting balance', () => {
    expect(() => topUp(-1, p300)).toThrow(RangeError);
  });
});

describe('canAfford / getMissingCoins', () => {
  it('is true when the balance covers the cost exactly', () => {
    expect(canAfford(20, 20)).toBe(true);
    expect(getMissingCoins(20, 20)).toBe(0);
  });

  it('reports how many coins are missing', () => {
    expect(canAfford(15, 20)).toBe(false);
    expect(getMissingCoins(15, 20)).toBe(5);
  });
});

describe('spendCoins', () => {
  it('deducts the cost', () => {
    expect(spendCoins(100, 20)).toEqual({ ok: true, balance: 80 });
  });

  it('never goes negative', () => {
    expect(spendCoins(15, 20)).toEqual({
      ok: false,
      reason: 'insufficient_coins',
      missingCoins: 5,
    });
  });

  it.each([
    [-1, 10],
    [10, -1],
    [10, 1.5],
  ])('rejects invalid amounts (balance %d, cost %d)', (balance, cost) => {
    expect(() => spendCoins(balance, cost)).toThrow(RangeError);
  });
});

describe('findPackCovering', () => {
  it('suggests the cheapest pack that covers the missing coins', () => {
    expect(findPackCovering(packs, 5)).toBe(p300);
    expect(findPackCovering(packs, 301)).toBe(p800);
  });

  it('falls back to the largest pack', () => {
    expect(findPackCovering(packs, 10_000)).toBe(p2500);
  });

  it('returns undefined when there are no packs', () => {
    expect(findPackCovering([], 5)).toBeUndefined();
  });
});
