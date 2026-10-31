import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { backgroundColors } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** Safe-area edges to pad. Screens under a tab bar or with a full-bleed hero choose their own. */
  edges?: readonly Edge[];
};

/** Safe area + screen background. Scrolling is each screen's own list (see CLAUDE.md). */
export function Screen({ children, edges = ['top'] }: ScreenProps) {
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
