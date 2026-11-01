import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { backgroundColors, layout, spacing } from '@/theme';

import { HeaderTitle } from './HeaderTitle';

type HeaderProps = {
  /**
   * `main`: solid, takes its own space above the content.
   * `secondary`: floats over the content, transparent until the user scrolls.
   */
  variant?: 'main' | 'secondary';
  left?: ReactNode;
  right?: ReactNode;
  title?: string;
  /** `secondary` only: from `useHeaderScroll`. Without it the header stays transparent. */
  scrollY?: SharedValue<number>;
};

/** 0 at the top of the list, fully solid after scrolling one header height. */
export function getHeaderBackgroundOpacity(scrollY: number): number {
  'worklet';
  return interpolate(scrollY, [0, layout.headerHeight], [0, 1], Extrapolation.CLAMP);
}

export function Header({ variant = 'main', left, right, title, scrollY }: HeaderProps) {
  const { top } = useSafeAreaInsets();
  const isSecondary = variant === 'secondary';
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: scrollY ? getHeaderBackgroundOpacity(scrollY.get()) : 0,
  }));

  return (
    <View
      // box-none: the empty parts of a floating header let touches through to the content.
      pointerEvents="box-none"
      style={[styles.header, { paddingTop: top }, isSecondary ? styles.floating : styles.solid]}
    >
      {isSecondary && (
        <Animated.View pointerEvents="none" style={[styles.background, backgroundStyle]} />
      )}
      <View pointerEvents="box-none" style={styles.row}>
        {left}
        <View
          pointerEvents="box-none"
          style={[styles.title, isSecondary ? styles.titleStart : styles.titleCenter]}
        >
          {title !== undefined && <HeaderTitle>{title}</HeaderTitle>}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
  },
  solid: {
    backgroundColor: backgroundColors.screen,
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: backgroundColors.screen,
  },
  row: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: layout.screenGutter,
  },
  title: {
    flex: 1,
  },
  titleStart: {
    alignItems: 'flex-start',
  },
  titleCenter: {
    alignItems: 'center',
  },
});
