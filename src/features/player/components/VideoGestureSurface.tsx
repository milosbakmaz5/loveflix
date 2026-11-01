import type { LucideIcon } from 'lucide-react-native';
import { RotateCcw, RotateCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  type AccessibilityActionEvent,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { GestureDetector, useExclusiveGestures, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  type AnimatedStyle,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon, Text } from '@/components/ui';
import { backgroundColors, radii, spacing } from '@/theme';

import { SEEK_STEP_SEC } from '../utils/playbackTime';

type VideoGestureSurfaceProps = {
  isPaused: boolean;
  onTogglePause: () => void;
  onSeekBy: (seconds: number) => void;
};

type SeekFeedbackProps = {
  icon: LucideIcon;
  label: string;
  style: AnimatedStyle<ViewStyle>;
  sideStyle: ViewStyle;
};

const DOUBLE_TAP_MAX_DELAY_MS = 250;

function SeekFeedback({ icon, label, style, sideStyle }: SeekFeedbackProps) {
  return (
    <Animated.View style={[styles.feedback, sideStyle, style]} pointerEvents="none">
      <View style={styles.feedbackContent}>
        <Icon icon={icon} size="lg" />
        <Text variant="bodyStrong">{label}</Text>
      </View>
    </Animated.View>
  );
}

function flash(opacity: SharedValue<number>) {
  opacity.set(
    withSequence(withTiming(1, { duration: 80 }), withDelay(400, withTiming(0, { duration: 200 }))),
  );
}

/** One tap pauses; a double tap on the left or right half skips back or forward. */
export function VideoGestureSurface({
  isPaused,
  onTogglePause,
  onSeekBy,
}: VideoGestureSurfaceProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const rewindOpacity = useSharedValue(0);
  const forwardOpacity = useSharedValue(0);
  const rewindStyle = useAnimatedStyle(() => ({ opacity: rewindOpacity.get() }));
  const forwardStyle = useAnimatedStyle(() => ({ opacity: forwardOpacity.get() }));

  function rewind() {
    flash(rewindOpacity);
    onSeekBy(-SEEK_STEP_SEC);
  }

  function forward() {
    flash(forwardOpacity);
    onSeekBy(SEEK_STEP_SEC);
  }

  const singleTap = useTapGesture({
    runOnJS: true,
    testID: 'video-single-tap',
    onActivate: () => onTogglePause(),
  });
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    maxDelay: DOUBLE_TAP_MAX_DELAY_MS,
    runOnJS: true,
    testID: 'video-double-tap',
    onActivate: (event) => (event.x < width / 2 ? rewind() : forward()),
  });
  // Double tap first: a single tap only counts once a second tap can no longer follow.
  const gesture = useExclusiveGestures(doubleTap, singleTap);

  function handleAccessibilityAction({ nativeEvent }: AccessibilityActionEvent) {
    if (nativeEvent.actionName === 'rewind') {
      rewind();
    } else if (nativeEvent.actionName === 'forward') {
      forward();
    }
  }

  return (
    <>
      <GestureDetector gesture={gesture}>
        <View
          style={StyleSheet.absoluteFill}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t(isPaused ? 'player.play' : 'player.pause')}
          accessibilityActions={[
            { name: 'rewind', label: t('player.rewind', { seconds: SEEK_STEP_SEC }) },
            { name: 'forward', label: t('player.forward', { seconds: SEEK_STEP_SEC }) },
          ]}
          onAccessibilityTap={onTogglePause}
          onAccessibilityAction={handleAccessibilityAction}
        />
      </GestureDetector>
      <SeekFeedback
        icon={RotateCcw}
        label={t('player.rewindShort', { seconds: SEEK_STEP_SEC })}
        style={rewindStyle}
        sideStyle={styles.left}
      />
      <SeekFeedback
        icon={RotateCw}
        label={t('player.forwardShort', { seconds: SEEK_STEP_SEC })}
        style={forwardStyle}
        sideStyle={styles.right}
      />
    </>
  );
}

const styles = StyleSheet.create({
  feedback: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: { left: 0 },
  right: { right: 0 },
  feedbackContent: {
    alignItems: 'center',
    gap: spacing.xxs,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: backgroundColors.overlay,
  },
});
