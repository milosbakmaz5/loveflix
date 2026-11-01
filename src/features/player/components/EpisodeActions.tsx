import * as Haptics from 'expo-haptics';
import { useAtomValue, useSetAtom } from 'jotai';
import { Heart, type LucideIcon, MessageCircle, Share2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PressableScale, Text } from '@/components/ui';
import type { Episode } from '@/domain';
import { formatCompactNumber } from '@/lib/format';
import { backgroundColors, borderColors, type IconColor, layout, radii, spacing } from '@/theme';

import { likedEpisodeIdsAtom, toggleEpisodeLikeAtom } from '../state/likedEpisodes.atom';
import { PLAYER_BOTTOM_GAP } from '../utils/playerLayout';

type EpisodeActionsProps = {
  episode: Episode;
};

type ActionCircleProps = {
  icon: LucideIcon;
  label: string;
  color?: IconColor;
};

function ActionCircle({ icon, label, color }: ActionCircleProps) {
  return (
    <View style={styles.action}>
      <View style={styles.circle}>
        <Icon icon={icon} size="lg" color={color} />
      </View>
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </View>
  );
}

export function EpisodeActions({ episode }: EpisodeActionsProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const isLiked = useAtomValue(likedEpisodeIdsAtom).has(episode.id);
  const toggleLike = useSetAtom(toggleEpisodeLikeAtom);
  const likeCount = episode.likeCount + (isLiked ? 1 : 0);

  function handleLike() {
    void Haptics.selectionAsync();
    toggleLike(episode.id);
  }

  return (
    <View
      style={[styles.actions, { bottom: bottom + PLAYER_BOTTOM_GAP + spacing.xxl }]}
      pointerEvents="box-none"
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${t(isLiked ? 'player.unlike' : 'player.like')}, ${t('player.likes', {
          count: likeCount,
        })}`}
        accessibilityState={{ selected: isLiked }}
        onPress={handleLike}
      >
        <ActionCircle
          icon={Heart}
          label={formatCompactNumber(likeCount)}
          color={isLiked ? 'brand' : 'primary'}
        />
      </PressableScale>
      {/* Comments and sharing have nowhere to go yet, so they aren't buttons. */}
      <View accessible accessibilityLabel={t('player.comments', { count: episode.commentCount })}>
        <ActionCircle icon={MessageCircle} label={formatCompactNumber(episode.commentCount)} />
      </View>
      <View accessible accessibilityLabel={t('player.share')}>
        <ActionCircle icon={Share2} label={t('player.share')} />
      </View>
    </View>
  );
}

const CIRCLE_SIZE = layout.minHitTarget + spacing.xxs;

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    right: layout.screenGutter,
    gap: spacing.lg,
  },
  action: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.overlay,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: borderColors.default,
  },
});
