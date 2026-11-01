import { ScrollView, StyleSheet, View } from 'react-native';

import type { Episode, MembershipPlan } from '@/domain';
import { spacing } from '@/theme';

import { useUnlockFlow } from '../hooks/useUnlockFlow';
import { LockedEpisodeHeader } from './LockedEpisodeHeader';
import { UnlockFooter } from './UnlockFooter';
import { UnlockOptionList } from './UnlockOptionList';

type UnlockContentProps = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  plans: readonly MembershipPlan[];
};

export function UnlockContent({ episode, seasonEpisodes, plans }: UnlockContentProps) {
  const flow = useUnlockFlow({ episode, seasonEpisodes, plans });

  return (
    <View style={styles.content}>
      {/* Short screens scroll the details; the actions always stay in reach. */}
      <ScrollView
        style={styles.details}
        contentContainerStyle={styles.detailsContent}
        bounces={false}
      >
        <LockedEpisodeHeader episode={episode} />
        <UnlockOptionList
          options={flow.options}
          selectedType={flow.selectedType}
          onSelect={flow.select}
        />
      </ScrollView>
      <UnlockFooter onConfirm={flow.confirm} onWatchAd={flow.watchAd} onDismiss={flow.dismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexShrink: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  details: {
    flexShrink: 1,
    // Edge to edge inside the card, so rows and their badge aren't cut off while scrolling.
    marginHorizontal: -spacing.xl,
  },
  detailsContent: {
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xs,
  },
});
