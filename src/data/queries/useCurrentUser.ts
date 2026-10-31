import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { UserProfile } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useCurrentUser(): UseQueryResult<UserProfile> {
  const { catalog } = useRepositories();

  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => catalog.getCurrentUser(),
  });
}
