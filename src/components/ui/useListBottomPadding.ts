import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

type ListBottomPaddingOptions = {
  /** The tab bar takes its own space and covers the home indicator, so only the gap is needed. */
  hasTabBar: boolean;
};

/** Padding at the end of every scrolling list, so the last item is never covered. */
export function useListBottomPadding({ hasTabBar }: ListBottomPaddingOptions): number {
  const { bottom } = useSafeAreaInsets();
  return hasTabBar ? spacing.xl : bottom + spacing.xl;
}
