import type { CoinUnlockOption } from '@/domain';

/** Route params are untrusted text. Anything unexpected means the single episode. */
export function parseCoinOptionType(param: string | undefined): CoinUnlockOption['type'] {
  return param === 'season' ? 'season' : 'episode';
}
