import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Icon, PressableScale, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

type ShowMoreEpisodesProps = {
  onPress: () => void;
};

export function ShowMoreEpisodes({ onPress }: ShowMoreEpisodesProps) {
  const { t } = useTranslation();
  const label = t('series.showMore');

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.button}
    >
      <Text variant="body" color="secondary">
        {label}
      </Text>
      <Icon icon={ChevronRight} size="sm" color="secondary" />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.minHitTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
