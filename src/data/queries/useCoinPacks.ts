import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { CoinPack } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useCoinPacks(): UseQueryResult<readonly CoinPack[]> {
  const { store } = useRepositories();

  return useQuery({
    queryKey: queryKeys.coinPacks(),
    queryFn: () => store.getCoinPacks(),
  });
}
