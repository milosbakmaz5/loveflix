import { router } from 'expo-router';
import { Heart, Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button, IconButton } from '@/components/ui';
import type { SeriesId } from '@/domain';
import { layout, spacing } from '@/theme';

import { useMyList } from '../hooks/useMyList';

type SeriesActionsProps = {
  seriesId: SeriesId;
};

export function SeriesActions({ seriesId }: SeriesActionsProps) {
  const { t } = useTranslation();
  const { isInList, toggle } = useMyList(seriesId);

  return (
    <View style={styles.actions}>
      <View style={styles.play}>
        <Button
          label={t('series.playEpisode', { number: 1 })}
          icon={Play}
          haptic
          fullWidth
          onPress={() =>
            router.push({
              pathname: '/watch/[seriesId]',
              params: { seriesId, episode: '1', autoplay: 'true' },
            })
          }
        />
      </View>
      <IconButton
        icon={Heart}
        size="lg"
        color={isInList ? 'brand' : 'primary'}
        selected={isInList}
        accessibilityLabel={t(isInList ? 'home.removeFromList' : 'home.addToList')}
        onPress={toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenGutter,
  },
  play: {
    flex: 1,
  },
});
