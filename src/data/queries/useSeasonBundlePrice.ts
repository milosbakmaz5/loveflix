import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Money } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useSeasonBundlePrice(): UseQueryResult<Money> {
  const { store } = useRepositories();

  return useQuery({
    queryKey: queryKeys.seasonBundlePrice(),
    queryFn: () => store.getSeasonBundlePrice(),
  });
}
