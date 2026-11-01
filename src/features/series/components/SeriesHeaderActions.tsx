import { Heart, Share2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon, IconButton } from '@/components/ui';
import type { SeriesId } from '@/domain';
import { backgroundColors, spacing } from '@/theme';

import { useMyList } from '../hooks/useMyList';

type SeriesHeaderActionsProps = {
  seriesId: SeriesId;
};

export function SeriesHeaderActions({ seriesId }: SeriesHeaderActionsProps) {
  const { t } = useTranslation();
  const { isInList, toggle } = useMyList(seriesId);

  return (
    <View style={styles.actions}>
      <IconButton
        icon={Heart}
        variant="filled"
        color={isInList ? 'brand' : 'primary'}
        selected={isInList}
        accessibilityLabel={t(isInList ? 'home.removeFromList' : 'home.addToList')}
        onPress={toggle}
      />
      {/* Sharing has nowhere to go yet, so it isn't a button. Same as in the player. */}
      <View style={styles.share} accessible accessibilityLabel={t('player.share')}>
        <Icon icon={Share2} size="md" />
      </View>
    </View>
  );
}

const SHARE_SIZE = 40;

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  share: {
    width: SHARE_SIZE,
    height: SHARE_SIZE,
    borderRadius: SHARE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.overlay,
  },
});
