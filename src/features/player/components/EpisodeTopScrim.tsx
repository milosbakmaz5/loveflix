import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { useHeaderHeight } from '@/components/ui';
import { gradients } from '@/theme';

/** Keeps the status bar and back button readable over bright footage. */
export function EpisodeTopScrim() {
  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient
      colors={gradients.scrim}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={[styles.scrim, { height: headerHeight }]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
