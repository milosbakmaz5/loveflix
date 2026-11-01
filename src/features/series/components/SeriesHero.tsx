import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ListVideo, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon, MetaRow, Tag, Text } from '@/components/ui';
import type { Series } from '@/domain';
import { formatCompactNumber } from '@/lib/format';
import { gradients, layout, spacing } from '@/theme';

type SeriesHeroProps = {
  series: Series;
};

/** Height relative to the screen width, as in the design. */
const HERO_RATIO = 1.1;

export function SeriesHero({ series }: SeriesHeroProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const tags =
    series.tags.length > 0 ? series.tags : series.genres.map((genre) => t(`genres.${genre}`));

  return (
    <View style={{ height: width * HERO_RATIO }}>
      <Image source={series.heroImage} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={gradients.scrim} style={styles.scrim} />
      <View style={styles.content}>
        <View style={styles.tags}>
          {tags.map((tag) => (
            <Tag key={tag} label={tag} variant="outline" />
          ))}
        </View>
        <Text variant="display" accessibilityRole="header" numberOfLines={2}>
          {series.title}
        </Text>
        <MetaRow
          color="primary"
          items={[
            {
              key: 'rating',
              content: (
                <View
                  style={styles.iconText}
                  accessible
                  accessibilityLabel={t('series.rating', { rating: series.rating })}
                >
                  <Icon icon={Star} size="sm" />
                  <Text variant="bodySmall">{series.rating}</Text>
                  <Text variant="bodySmall" color="secondary">
                    ({formatCompactNumber(series.ratingCount)})
                  </Text>
                </View>
              ),
            },
            { key: 'year', content: String(series.year) },
            {
              key: 'episodes',
              content: (
                <View style={styles.iconText}>
                  <Icon icon={ListVideo} size="sm" />
                  <Text variant="bodySmall">
                    {t('series.episodeCount', { count: series.episodeCount })}
                  </Text>
                </View>
              ),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    left: layout.screenGutter,
    right: layout.screenGutter,
    bottom: 0,
    gap: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});
