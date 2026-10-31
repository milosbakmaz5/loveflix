import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { Series } from '@/domain';
import { formatDecimal } from '@/lib/format';
import { backgroundColors, gradients, radii, spacing } from '@/theme';

import { Badge } from './Badge';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type PosterSize = 'md' | 'lg';

/** Poster widths; height is always 3:2 of the width. Rails use these to size their rows. */
export const POSTER_WIDTH: Record<PosterSize, number> = { md: 128, lg: 148 };
const POSTER_RATIO = 1.5;
/** Two lines of `h3` under the poster. */
const TITLE_HEIGHT = 44;

export function getPosterCardHeight(size: PosterSize): number {
  return POSTER_WIDTH[size] * POSTER_RATIO + spacing.xs + TITLE_HEIGHT;
}

type PosterCardProps = {
  series: Series;
  onPress: (series: Series) => void;
  size?: PosterSize;
};

export function PosterCard({ series, onPress, size = 'md' }: PosterCardProps) {
  const { t, i18n } = useTranslation();
  const width = POSTER_WIDTH[size];
  const labelKey = series.isPro ? 'series.posterLabelPro' : 'series.posterLabel';

  return (
    <PressableScale
      onPress={() => onPress(series)}
      accessibilityRole="button"
      accessibilityLabel={t(labelKey, { title: series.title, count: series.episodeCount })}
      style={[styles.card, { width }]}
    >
      <View style={[styles.poster, { width, height: width * POSTER_RATIO }]}>
        <Image
          source={series.posterImage}
          recyclingKey={series.id}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
        />
        <LinearGradient colors={gradients.scrim} style={styles.scrim}>
          <Text variant="caption" color="primary">
            {t('series.episodeCount', { count: series.episodeCount })}
          </Text>
          <Text variant="caption" color="primary">
            {t('series.minutesPerEpisode', {
              minutes: formatDecimal(series.minutesPerEpisode, i18n.language),
            })}
          </Text>
        </LinearGradient>
        {series.isPro && (
          <View style={styles.badge}>
            <Badge variant="pro" />
          </View>
        )}
      </View>
      <Text variant="h3" numberOfLines={2} style={styles.title}>
        {series.title}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  poster: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: backgroundColors.surface,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
  },
  title: {
    height: TITLE_HEIGHT,
  },
});
