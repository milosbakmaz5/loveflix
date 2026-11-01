import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/** Connects a scrolling list to a `secondary` Header: `<Header scrollY={scrollY} />`. */
export function useHeaderScroll() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  return { scrollY, onScroll };
}
