import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import type { CoinPackId } from '@/domain';

import type { CoinPurchaseReceipt } from '../repositories';
import { useRepositories } from '../RepositoryProvider';

/** The mock "App Store payment". Crediting the coins to the wallet happens in the state layer. */
export function usePurchaseCoinPack(): UseMutationResult<CoinPurchaseReceipt, Error, CoinPackId> {
  const { store } = useRepositories();

  return useMutation({
    mutationFn: (packId: CoinPackId) => store.purchaseCoinPack(packId),
  });
}
