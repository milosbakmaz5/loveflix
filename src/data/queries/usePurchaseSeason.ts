import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import type { SeriesId } from '@/domain';

import type { SeasonPurchaseReceipt } from '../repositories';
import { useRepositories } from '../RepositoryProvider';

/** The mock "App Store payment". Granting the episodes happens in the state layer. */
export function usePurchaseSeason(): UseMutationResult<SeasonPurchaseReceipt, Error, SeriesId> {
  const { store } = useRepositories();

  return useMutation({
    mutationFn: (seriesId: SeriesId) => store.purchaseSeason(seriesId),
  });
}
