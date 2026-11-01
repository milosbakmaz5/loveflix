import { useState } from 'react';

import type { Episode } from '@/domain';

import {
  COLLAPSED_EPISODE_COUNT,
  type EpisodeOrder,
  getVisibleEpisodes,
} from '../utils/getVisibleEpisodes';

type SeriesEpisodes = {
  visibleEpisodes: readonly Episode[];
  hasMore: boolean;
  showMore: () => void;
  toggleOrder: () => void;
};

export function useSeriesEpisodes(episodes: readonly Episode[]): SeriesEpisodes {
  const [order, setOrder] = useState<EpisodeOrder>('firstToLast');
  const [isExpanded, setIsExpanded] = useState(false);

  return {
    visibleEpisodes: getVisibleEpisodes(episodes, order, isExpanded),
    hasMore: !isExpanded && episodes.length > COLLAPSED_EPISODE_COUNT,
    showMore: () => setIsExpanded(true),
    toggleOrder: () =>
      setOrder((current) => (current === 'firstToLast' ? 'lastToFirst' : 'firstToLast')),
  };
}
