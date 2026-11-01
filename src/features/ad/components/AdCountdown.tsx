import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { DEMO_CONFIG } from '@/config/demo';
import { backgroundColors, layout, radii, spacing } from '@/theme';

type AdCountdownProps = {
  secondsLeft: number;
};

export function AdCountdown({ secondsLeft }: AdCountdownProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }));

  useEffect(() => {
    progress.set(
      withTiming(1, { duration: DEMO_CONFIG.adDurationSec * 1000, easing: Easing.linear }),
    );
  }, [progress]);

  return (
    <View style={[styles.countdown, { paddingBottom: bottom + spacing.md }]}>
      <Text variant="bodyStrong" align="center" accessibilityLiveRegion="polite">
        {t('ad.unlocksIn', { count: secondsLeft })}
      </Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  countdown: {
    gap: spacing.sm,
    paddingHorizontal: layout.screenGutter,
  },
  track: {
    height: spacing.xxs,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: backgroundColors.track,
  },
  fill: {
    flex: 1,
    transformOrigin: 'left',
    backgroundColor: backgroundColors.brand,
  },
});
