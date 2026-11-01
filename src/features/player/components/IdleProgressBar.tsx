import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { VideoProgressBar } from './VideoProgressBar';

function ignore() {}

/** The empty bar on a slide that isn't playing yet. It looks real but takes no input. */
export function IdleProgressBar() {
  const currentTime = useSharedValue(0);
  const duration = useSharedValue(1);

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <VideoProgressBar
        currentTime={currentTime}
        duration={duration}
        onScrubStart={ignore}
        onScrubEnd={ignore}
        onSeekBy={ignore}
      />
    </View>
  );
}
