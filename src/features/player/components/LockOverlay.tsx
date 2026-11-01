import { Coins, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, PressableScale, Text } from '@/components/ui';
import { backgroundColors, borderColors, radii, spacing } from '@/theme';

type LockOverlayProps = {
  episodeNumber: number;
  onUnlock: () => void;
};

/** Dims the slide and offers the unlock. Touches outside the card still reach the list. */
export function LockOverlay({ episodeNumber, onUnlock }: LockOverlayProps) {
  const { t } = useTranslation();
  const label = t('player.unlockEpisode', { number: episodeNumber });

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.dim} pointerEvents="none" />
      <PressableScale
        haptic
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onUnlock}
      >
        <View style={styles.card}>
          <View>
            <Icon icon={Lock} size="xl" />
            <View style={styles.coins}>
              <Icon icon={Coins} size="sm" color="coin" />
            </View>
          </View>
          <Text variant="bodyStrong">{label}</Text>
        </View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: backgroundColors.imageDim,
  },
  card: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
    backgroundColor: backgroundColors.surfaceLock,
  },
  coins: {
    position: 'absolute',
    right: -spacing.xs,
    bottom: -spacing.xxs,
  },
});
