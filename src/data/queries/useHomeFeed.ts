import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import type { HomeFeedData } from '../repositories';
import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useHomeFeed(): UseQueryResult<HomeFeedData> {
  const { catalog } = useRepositories();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.homeFeed(),
    queryFn: async () => {
      const data = await catalog.getHomeFeed();
      // Seed the series cache so opening a series from Home shows it without a spinner.
      for (const series of data.series) {
        queryClient.setQueryData(queryKeys.series(series.id), series);
      }
      return data;
    },
  });
}
