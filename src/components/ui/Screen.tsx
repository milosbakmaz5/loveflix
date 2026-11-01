import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { backgroundColors } from '@/theme';

type ScreenProps = {
  children: ReactNode;
};

/** Screen background. Header pads the top, lists use useListBottomPadding (see CLAUDE.md). */
export function Screen({ children }: ScreenProps) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: backgroundColors.screen,
  },
});
