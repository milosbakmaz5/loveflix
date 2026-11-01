import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Episode } from '@/domain';
import { useEpisodeAccess } from '@/state';

import { EpisodeActions } from './EpisodeActions';
import { EpisodeInfo } from './EpisodeInfo';
import { EpisodeScrim } from './EpisodeScrim';
import { EpisodeTopScrim } from './EpisodeTopScrim';
import { EpisodeVideo } from './EpisodeVideo';
import { IdleProgressBar } from './IdleProgressBar';
import { LockOverlay } from './LockOverlay';

type EpisodeSlideProps = {
  episode: Episode;
  seriesTitle: string;
  height: number;
  isActive: boolean;
  isWatchMode: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onTogglePause: () => void;
  onFinished: () => void;
};

export function EpisodeSlide({
  episode,
  seriesTitle,
  height,
  isActive,
  isWatchMode,
  isPaused,
  onPlay,
  onTogglePause,
  onFinished,
}: EpisodeSlideProps) {
  const { isUnlocked } = useEpisodeAccess(episode);
  const [videoAttempt, setVideoAttempt] = useState(0);
  const isInWatchMode = isWatchMode && isUnlocked;
  // A paused video stays on screen until the viewer moves to another episode.
  const hasVideo = isActive && (isInWatchMode || (isUnlocked && isPaused));

  function openUnlock() {
    router.push({
      pathname: '/unlock/[episodeId]',
      params: { episodeId: episode.id, seriesId: episode.seriesId },
    });
  }

  return (
    <View style={{ height }}>
      <Image
        source={episode.thumbnail}
        recyclingKey={episode.id}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      {hasVideo ? (
        <EpisodeVideo
          key={`${episode.id}-${videoAttempt}`}
          source={episode.video}
          shouldPlay={!isPaused}
          onFinished={onFinished}
          onRetry={() => setVideoAttempt((attempt) => attempt + 1)}
          onTogglePause={onTogglePause}
        />
      ) : (
        <>
          {/* A slide coming in looks like it will once playing, so nothing pops when it starts. */}
          {isInWatchMode && <EpisodeTopScrim />}
          <EpisodeScrim />
          {isInWatchMode && <IdleProgressBar />}
        </>
      )}
      <EpisodeInfo
        episode={episode}
        seriesTitle={seriesTitle}
        isWatchVisible={!isInWatchMode}
        onWatch={isUnlocked ? onPlay : openUnlock}
      />
      {!isUnlocked && <LockOverlay episodeNumber={episode.number} onUnlock={openUnlock} />}
      <EpisodeActions episode={episode} />
    </View>
  );
}
