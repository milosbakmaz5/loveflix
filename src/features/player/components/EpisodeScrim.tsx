import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { gradients } from '@/theme';

/** Keeps the episode info readable over the artwork or video. */
export function EpisodeScrim() {
  return <LinearGradient colors={gradients.scrim} style={styles.scrim} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
});
