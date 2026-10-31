import { type CoinPackId, totalCoins } from '@/domain';
import { coinPacks, membershipPlans } from '@/data/mocks';

import { RepositoryError } from './errors';
import { createSimulate, type MockRepositoryOptions } from './simulate';
import type { StoreRepository } from './StoreRepository';

export function createMockStoreRepository(options?: MockRepositoryOptions): StoreRepository {
  const simulate = createSimulate(options);

  return {
    getCoinPacks: () => simulate('getCoinPacks', () => coinPacks),
    getMembershipPlans: () => simulate('getMembershipPlans', () => membershipPlans),
    purchaseCoinPack: (packId: CoinPackId) =>
      simulate('purchaseCoinPack', () => {
        const pack = coinPacks.find((item) => item.id === packId);
        if (pack === undefined) {
          throw new RepositoryError('notFound', `Coin pack "${packId}" not found`);
        }
        return { packId, coinsGranted: totalCoins(pack) };
      }),
  };
}
