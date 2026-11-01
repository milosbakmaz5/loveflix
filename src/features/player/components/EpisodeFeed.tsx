import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';

import type { Episode } from '@/domain';

import { useEpisodeFeed } from '../hooks/useEpisodeFeed';
import { EpisodeSlide } from './EpisodeSlide';

type EpisodeFeedProps = {
  seriesTitle: string;
  episodes: readonly Episode[];
  initialIndex: number;
  autoplay?: boolean;
};

function getEpisodeKey(episode: Episode) {
  return episode.id;
}

export function EpisodeFeed({
  seriesTitle,
  episodes,
  initialIndex,
  autoplay = false,
}: EpisodeFeedProps) {
  const { height } = useWindowDimensions();
  const listRef = useRef<FlashListRef<Episode>>(null);
  const feed = useEpisodeFeed({ episodes, initialIndex, autoplay, listRef });

  return (
    <FlashList
      ref={listRef}
      data={episodes}
      keyExtractor={getEpisodeKey}
      initialScrollIndex={initialIndex}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      viewabilityConfig={feed.viewabilityConfig}
      onViewableItemsChanged={feed.onViewableItemsChanged}
      renderItem={({ item }) => {
        const isActive = item.id === feed.activeEpisodeId;
        return (
          <EpisodeSlide
            episode={item}
            seriesTitle={seriesTitle}
            height={height}
            isActive={isActive}
            isWatchMode={feed.isWatchMode}
            isPaused={isActive && feed.isPaused}
            onPlay={feed.play}
            onTogglePause={feed.togglePause}
            onFinished={feed.finishEpisode}
          />
        );
      }}
    />
  );
}
