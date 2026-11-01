import { StyleSheet, View } from 'react-native';

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
      <LockedEpisodeHeader episode={episode} />
      <UnlockOptionList
        options={flow.options}
        selectedType={flow.selectedType}
        onSelect={flow.select}
      />
      <UnlockFooter onConfirm={flow.confirm} onWatchAd={flow.watchAd} onDismiss={flow.dismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
});
