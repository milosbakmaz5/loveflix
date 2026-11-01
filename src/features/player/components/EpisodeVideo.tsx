import { VideoView } from 'expo-video';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ErrorState } from '@/components/ui';
import type { VideoRef } from '@/domain';
import { iconColors } from '@/theme';

import { useEpisodePlayer } from '../hooks/useEpisodePlayer';
import { EpisodeScrim } from './EpisodeScrim';
import { EpisodeTopScrim } from './EpisodeTopScrim';
import { VideoGestureSurface } from './VideoGestureSurface';
import { VideoProgressBar } from './VideoProgressBar';

type EpisodeVideoProps = {
  source: VideoRef;
  shouldPlay: boolean;
  onFinished: () => void;
  onRetry: () => void;
  onTogglePause: () => void;
};

/** The single VideoView of the feed and its controls. Fades in once its first frame is ready. */
export function EpisodeVideo({
  source,
  shouldPlay,
  onFinished,
  onRetry,
  onTogglePause,
}: EpisodeVideoProps) {
  const { t } = useTranslation();
  const { player, hasFailed, currentTime, duration, seekBy, startScrub, endScrub } =
    useEpisodePlayer({ source, shouldPlay, onFinished });
  const [hasFirstFrame, setHasFirstFrame] = useState(false);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: withTiming(hasFirstFrame ? 1 : 0) }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]} pointerEvents="none">
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          onFirstFrameRender={() => setHasFirstFrame(true)}
        />
      </Animated.View>
      <EpisodeTopScrim />
      <EpisodeScrim />
      <VideoGestureSurface isPaused={!shouldPlay} onTogglePause={onTogglePause} onSeekBy={seekBy} />
      {hasFailed && <ErrorState error={null} message={t('player.videoError')} onRetry={onRetry} />}
      {!hasFailed && !hasFirstFrame && (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color={iconColors.primary} />
        </View>
      )}
      {!hasFailed && (
        <VideoProgressBar
          currentTime={currentTime}
          duration={duration}
          onScrubStart={startScrub}
          onScrubEnd={endScrub}
          onSeekBy={seekBy}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
