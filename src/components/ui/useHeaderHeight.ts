import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/theme';

/** Full Header height. Content under a floating (`secondary`) Header uses it as top padding. */
export function useHeaderHeight(): number {
  return useSafeAreaInsets().top + layout.headerHeight;
}
