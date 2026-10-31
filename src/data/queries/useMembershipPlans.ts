import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { MembershipPlan } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useMembershipPlans(): UseQueryResult<readonly MembershipPlan[]> {
  const { store } = useRepositories();

  return useQuery({
    queryKey: queryKeys.membershipPlans(),
    queryFn: () => store.getMembershipPlans(),
  });
}
