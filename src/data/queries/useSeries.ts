import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Series, SeriesId } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useSeries(seriesId: SeriesId): UseQueryResult<Series> {
  const { catalog } = useRepositories();

  return useQuery({
    queryKey: queryKeys.series(seriesId),
    queryFn: () => catalog.getSeries(seriesId),
  });
}
