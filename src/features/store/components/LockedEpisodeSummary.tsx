import { Image } from 'expo-image';
import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import type { Episode, Series } from '@/domain';
import { backgroundColors, radii, spacing } from '@/theme';

type LockedEpisodeSummaryProps = {
  series: Series;
  episode: Episode;
  unlockCost: number;
};

export function LockedEpisodeSummary({ series, episode, unlockCost }: LockedEpisodeSummaryProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.poster}>
          <Image source={series.posterImage} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.lock}>
            <Icon icon={Lock} size="sm" />
          </View>
        </View>
        <View style={styles.details}>
          <Text variant="h2">{series.title}</Text>
          <Text variant="bodySmall" color="secondary">
            {t('store.episodeLocked', { number: episode.number })}
          </Text>
          <View style={styles.cost}>
            <Icon icon={Lock} size="sm" color="brand" />
            <Text variant="bodySmall" color="brand">
              {t('store.unlockFor', { count: unlockCost })}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const LOCK_SIZE = 24;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  lock: {
    position: 'absolute',
    top: spacing.xxs,
    right: spacing.xxs,
    width: LOCK_SIZE,
    height: LOCK_SIZE,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.overlay,
  },
  details: {
    flex: 1,
    alignItems: 'flex-start',
    gap: spacing.xxs,
  },
  cost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
    backgroundColor: backgroundColors.surfaceSelected,
  },
});
