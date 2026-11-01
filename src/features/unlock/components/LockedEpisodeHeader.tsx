import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import type { Episode } from '@/domain';
import { backgroundColors, radii, spacing } from '@/theme';

type LockedEpisodeHeaderProps = {
  episode: Episode;
};

export function LockedEpisodeHeader({ episode }: LockedEpisodeHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.thumbnail}>
        <Image source={episode.thumbnail} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={styles.dim}>
          <View style={styles.lock}>
            <Icon icon={Lock} size="md" />
          </View>
          <Text variant="badge">{t('badges.locked')}</Text>
        </View>
      </View>
      <View style={styles.titles}>
        <Text variant="overline" color="brand" align="center">
          {t('unlock.episode', { number: episode.number })}
        </Text>
        <Text variant="h1" align="center" accessibilityRole="header">
          {t('unlock.title')}
        </Text>
        <Text variant="body" color="secondary" align="center">
          {t('unlock.subtitle')}
        </Text>
      </View>
    </View>
  );
}

const LOCK_SIZE = 36;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  thumbnail: {
    width: 100,
    height: 130,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    backgroundColor: backgroundColors.overlay,
  },
  lock: {
    width: LOCK_SIZE,
    height: LOCK_SIZE,
    borderRadius: LOCK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.screen,
  },
  titles: {
    alignSelf: 'stretch',
    gap: spacing.xs,
  },
});
