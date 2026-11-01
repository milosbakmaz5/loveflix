import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Clock, Lock, Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, PressableScale, Text } from '@/components/ui';
import type { Episode } from '@/domain';
import { formatDuration } from '@/lib/format';
import { useEpisodeAccess } from '@/state';
import { backgroundColors, layout, radii, spacing } from '@/theme';

type EpisodeRowProps = {
  episode: Episode;
};

export function EpisodeRow({ episode }: EpisodeRowProps) {
  const { t } = useTranslation();
  const { isUnlocked } = useEpisodeAccess(episode);
  const title = t('series.episodeTitle', { number: episode.number, title: episode.title });
  const duration = formatDuration(episode.durationSec);

  function openEpisode() {
    router.push({
      pathname: '/watch/[seriesId]',
      params: {
        seriesId: episode.seriesId,
        episode: String(episode.number),
        // A locked episode opens on its lock overlay instead.
        ...(isUnlocked ? { autoplay: 'true' } : {}),
      },
    });
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        isUnlocked ? `${title}, ${duration}` : `${title}, ${duration}, ${t('badges.locked')}`
      }
      onPress={openEpisode}
      style={styles.row}
    >
      <View style={styles.thumbnail}>
        <Image
          source={episode.thumbnail}
          recyclingKey={episode.id}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {!isUnlocked && <View style={styles.lockedDim} />}
        <View style={[styles.badge, isUnlocked ? styles.playBadge : styles.lockBadge]}>
          <Icon
            icon={isUnlocked ? Play : Lock}
            size="sm"
            color={isUnlocked ? 'onBrand' : 'primary'}
          />
        </View>
      </View>
      <View style={styles.details}>
        <Text variant="h3" numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.meta}>
          <Icon icon={Clock} size="sm" color="secondary" />
          <Text variant="bodySmall" color="secondary">
            {duration}
          </Text>
          {!isUnlocked && (
            <View style={styles.unlock}>
              <Text variant="bodySmall" color="accent">
                {t('series.unlock')}
              </Text>
              <Icon icon={Lock} size="sm" color="accent" />
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
}

const BADGE_SIZE = 32;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenGutter,
    paddingVertical: spacing.xs,
  },
  thumbnail: {
    width: 112,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: backgroundColors.surface,
  },
  lockedDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: backgroundColors.imageDim,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    backgroundColor: backgroundColors.brand,
  },
  lockBadge: {
    backgroundColor: backgroundColors.overlay,
  },
  details: {
    flex: 1,
    gap: spacing.xxs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  unlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginLeft: spacing.xs,
  },
});
