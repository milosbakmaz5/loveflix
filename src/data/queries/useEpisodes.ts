import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Episode, SeriesId } from '@/domain';

import { useRepositories } from '../RepositoryProvider';
import { queryKeys } from './queryKeys';

export function useEpisodes(seriesId: SeriesId): UseQueryResult<readonly Episode[]> {
  const { catalog } = useRepositories();

  return useQuery({
    queryKey: queryKeys.episodes(seriesId),
    queryFn: () => catalog.getEpisodes(seriesId),
  });
}
