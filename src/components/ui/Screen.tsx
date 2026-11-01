import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { backgroundColors } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** Safe-area edges to pad. None by default: Header pads the top, lists use useListBottomPadding. */
  edges?: readonly Edge[];
};

/** Safe area + screen background. Scrolling is each screen's own list (see CLAUDE.md). */
export function Screen({ children, edges = [] }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: backgroundColors.screen,
  },
});
