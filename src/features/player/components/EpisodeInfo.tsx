import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, MetaRow, Tag, Text } from '@/components/ui';
import type { Episode } from '@/domain';
import { formatDuration } from '@/lib/format';
import { layout, spacing } from '@/theme';

import { PLAYER_BOTTOM_GAP, PROGRESS_BAR_HEIGHT } from '../utils/playerLayout';

type EpisodeInfoProps = {
  episode: Episode;
  seriesTitle: string;
  isWatchVisible: boolean;
  onWatch: () => void;
};

const INFO_GAP = spacing.sm;
const TRANSITION_MS = 200;
// Fixed, not measured: a slide entering the screen must already sit in its final position.
const WATCH_ROW_HEIGHT = layout.minHitTarget;
const WATCH_MODE_OFFSET = WATCH_ROW_HEIGHT + INFO_GAP + PLAYER_BOTTOM_GAP - PROGRESS_BAR_HEIGHT;

export function EpisodeInfo({ episode, seriesTitle, isWatchVisible, onWatch }: EpisodeInfoProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  // In watch mode the block slides down by the Watch row, so the title rests on the progress bar.
  const infoStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isWatchVisible ? 0 : WATCH_MODE_OFFSET, {
          duration: TRANSITION_MS,
        }),
      },
    ],
  }));
  const watchStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isWatchVisible ? 1 : 0, { duration: TRANSITION_MS }),
  }));

  return (
    <Animated.View
      style={[styles.info, { bottom: bottom + PLAYER_BOTTOM_GAP }, infoStyle]}
      pointerEvents="box-none"
    >
      <Text variant="h2" accessibilityRole="header" numberOfLines={2}>
        {seriesTitle}
      </Text>
      <MetaRow
        items={[
          {
            key: 'number',
            content: <Tag label={t('player.episodeNumber', { number: episode.number })} />,
          },
          { key: 'duration', content: formatDuration(episode.durationSec) },
        ]}
      />
      <Animated.View
        style={[styles.watch, watchStyle]}
        pointerEvents={isWatchVisible ? 'auto' : 'none'}
        accessibilityElementsHidden={!isWatchVisible}
        importantForAccessibility={isWatchVisible ? 'auto' : 'no-hide-descendants'}
      >
        <Button label={t('player.watch')} icon={Play} size="md" haptic onPress={onWatch} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  info: {
    position: 'absolute',
    left: layout.screenGutter,
    // Keeps long titles clear of the action column.
    right: layout.screenGutter + spacing.xxxl + spacing.xl,
    gap: INFO_GAP,
  },
  watch: {
    alignSelf: 'flex-start',
    height: WATCH_ROW_HEIGHT,
  },
});
