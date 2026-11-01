import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AccessibilityActionEvent, StyleSheet, View } from 'react-native';
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Text } from '@/components/ui';
import { formatDuration } from '@/lib/format';
import { backgroundColors, layout, radii, spacing } from '@/theme';

import { TIME_UPDATE_INTERVAL_SEC } from '../hooks/useEpisodePlayer';
import { getTimeAtPosition, SEEK_STEP_SEC } from '../utils/playbackTime';
import { PROGRESS_BAR_HEIGHT } from '../utils/playerLayout';

type VideoProgressBarProps = {
  currentTime: SharedValue<number>;
  duration: SharedValue<number>;
  onScrubStart: () => void;
  /** Without a time the scrub was cancelled. */
  onScrubEnd: (time?: number) => void;
  onSeekBy: (seconds: number) => void;
};

const TRACK_HEIGHT = spacing.xxs;
// Horizontal drags scrub; vertical ones stay with the list that pages between episodes.
const PAN_ACTIVE_OFFSET_X: [number, number] = [-8, 8];
const PAN_FAIL_OFFSET_Y: [number, number] = [-12, 12];

export function VideoProgressBar({
  currentTime,
  duration,
  onScrubStart,
  onScrubEnd,
  onSeekBy,
}: VideoProgressBarProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const trackWidth = useSharedValue(0);
  // Null while just playing; the finger's time while dragging.
  const scrubTime = useSharedValue<number | null>(null);
  const shownTime = useDerivedValue(() => scrubTime.get() ?? currentTime.get());
  const [shownSeconds, setShownSeconds] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useAnimatedReaction(
    () => Math.floor(shownTime.get()),
    (seconds, previous) => {
      if (seconds !== previous) {
        scheduleOnRN(setShownSeconds, seconds);
      }
    },
  );

  function handleScrubStart() {
    setIsScrubbing(true);
    onScrubStart();
  }

  function handleScrubEnd(time?: number) {
    setIsScrubbing(false);
    onScrubEnd(time);
  }

  const pan = usePanGesture({
    activeOffsetX: PAN_ACTIVE_OFFSET_X,
    failOffsetY: PAN_FAIL_OFFSET_Y,
    testID: 'video-progress-pan',
    onActivate: (event) => {
      'worklet';
      scrubTime.set(
        getTimeAtPosition(event.x - layout.screenGutter, trackWidth.get(), duration.get()),
      );
      scheduleOnRN(handleScrubStart);
    },
    onUpdate: (event) => {
      'worklet';
      scrubTime.set(
        getTimeAtPosition(event.x - layout.screenGutter, trackWidth.get(), duration.get()),
      );
    },
    onDeactivate: (event) => {
      'worklet';
      const time = scrubTime.get();
      scrubTime.set(null);
      if (event.canceled || time === null) {
        scheduleOnRN(handleScrubEnd);
      } else {
        currentTime.set(time);
        scheduleOnRN(handleScrubEnd, time);
      }
    },
  });
  const tap = useTapGesture({
    runOnJS: true,
    testID: 'video-progress-tap',
    onActivate: (event) => {
      const time = getTimeAtPosition(
        event.x - layout.screenGutter,
        trackWidth.get(),
        duration.get(),
      );
      onScrubEnd(time);
    },
  });
  const gesture = useCompetingGestures(pan, tap);

  const fillStyle = useAnimatedStyle(() => {
    const ratio = shownTime.get() / duration.get();
    return { transform: [{ scaleX: followTime(ratio, scrubTime.get() !== null) }] };
  });

  function handleAccessibilityAction({ nativeEvent }: AccessibilityActionEvent) {
    onSeekBy(nativeEvent.actionName === 'increment' ? SEEK_STEP_SEC : -SEEK_STEP_SEC);
  }

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[styles.bar, { bottom }]}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={t('player.progress')}
        accessibilityValue={{ text: formatDuration(shownSeconds) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={handleAccessibilityAction}
      >
        {isScrubbing && (
          <View style={styles.time} pointerEvents="none">
            <Text variant="bodyStrong">{formatDuration(shownSeconds)}</Text>
          </View>
        )}
        <View
          style={styles.track}
          onLayout={(event) => trackWidth.set(event.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.fill, fillStyle]} />
        </View>
      </View>
    </GestureDetector>
  );
}

/** Glides between the player's time updates; follows the finger exactly while dragging. */
function followTime(value: number, isDragging: boolean): number {
  'worklet';
  return isDragging
    ? value
    : withTiming(value, { duration: TIME_UPDATE_INTERVAL_SEC * 1000, easing: Easing.linear });
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PROGRESS_BAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: layout.screenGutter,
  },
  time: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: PROGRESS_BAR_HEIGHT - spacing.xs,
    alignItems: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: backgroundColors.track,
    justifyContent: 'center',
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.pill,
    backgroundColor: backgroundColors.brand,
    transformOrigin: 'left',
  },
});
