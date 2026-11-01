import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, Play, Plus, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Badge, Button, Icon, IconButton, MetaRow, Text } from '@/components/ui';
import type { Series } from '@/domain';
import { useMyList } from '@/state';
import { backgroundColors, gradients, layout, spacing } from '@/theme';

type HeroSpotlightProps = {
  series: Series;
};

/** Height relative to the screen width, as in the design (402 × 500). */
const HERO_RATIO = 1.25;

export function HeroSpotlight({ series }: HeroSpotlightProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isInList, toggle } = useMyList(series.id);

  return (
    <View style={{ height: width * HERO_RATIO }}>
      <Image source={series.heroImage} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.dim} />
      <LinearGradient colors={gradients.scrim} style={styles.scrim} />
      <View style={styles.content}>
        <View style={styles.tags}>
          <Badge variant="spotlight" />
          <MetaRow
            items={series.genres.map((genre) => ({
              key: genre,
              content: t(`genres.${genre}`),
            }))}
          />
        </View>
        <View>
          <Text variant="display" accessibilityRole="header" numberOfLines={2}>
            {series.title}
          </Text>
          <Text variant="body" color="secondary">
            {series.tagline}
          </Text>
        </View>
        <MetaRow
          items={[
            {
              key: 'rating',
              content: (
                <View
                  style={styles.rating}
                  accessible
                  accessibilityLabel={t('series.rating', { rating: series.rating })}
                >
                  <Icon icon={Star} size="sm" />
                  <Text variant="bodySmall">{series.rating}</Text>
                </View>
              ),
            },
            { key: 'episodes', content: t('series.episodes', { count: series.episodeCount }) },
          ]}
        />
        <View style={styles.actions}>
          <View style={styles.watch}>
            <Button
              label={t('home.watchNow')}
              icon={Play}
              haptic
              fullWidth
              onPress={() =>
                router.push({
                  pathname: '/watch/[seriesId]',
                  params: { seriesId: series.id, autoplay: 'true' },
                })
              }
            />
          </View>
          <IconButton
            icon={isInList ? Check : Plus}
            size="lg"
            color={isInList ? 'brand' : 'primary'}
            selected={isInList}
            accessibilityLabel={t(isInList ? 'home.removeFromList' : 'home.addToList')}
            onPress={toggle}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: backgroundColors.imageDim,
  },
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
    bottom: spacing.lg,
    gap: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  watch: {
    flex: 1,
  },
});
