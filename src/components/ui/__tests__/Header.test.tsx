import { render, renderHook, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, spacing } from '@/theme';

import {
  getHeaderBackgroundOpacity,
  Header,
  HeaderTitle,
  useHeaderHeight,
  useListBottomPadding,
} from '..';

function useInsets() {
  return useSafeAreaInsets();
}

describe('Header', () => {
  it('renders the left and right slots and the title', async () => {
    await render(<Header left={<RNText>L</RNText>} right={<RNText>R</RNText>} title="Store" />);

    expect(screen.getByText('L')).toBeOnTheScreen();
    expect(screen.getByText('R')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Store' })).toBeOnTheScreen();
  });

  it('renders no title by default', async () => {
    await render(<Header left={<RNText>L</RNText>} />);
    expect(screen.queryByRole('header')).not.toBeOnTheScreen();
  });

  it.each(['main', 'secondary'] as const)(
    '%s keeps the same content height with and without a title',
    async (variant) => {
      const { rerender } = await render(<Header variant={variant} left={<RNText>L</RNText>} />);
      expect(screen.getByText('L').parent).toHaveStyle({ height: layout.headerHeight });

      await rerender(<Header variant={variant} left={<RNText>L</RNText>} title="Store" />);
      expect(screen.getByText('L').parent).toHaveStyle({ height: layout.headerHeight });
    },
  );
});

describe('HeaderTitle', () => {
  it('stays on one line', async () => {
    await render(<HeaderTitle>A long title</HeaderTitle>);
    expect(screen.getByText('A long title').props.numberOfLines).toBe(1);
  });
});

describe('getHeaderBackgroundOpacity', () => {
  it.each([
    [-20, 0],
    [0, 0],
    [layout.headerHeight / 2, 0.5],
    [layout.headerHeight, 1],
    [layout.headerHeight * 5, 1],
  ])('at scroll %p is %p', (scrollY, opacity) => {
    expect(getHeaderBackgroundOpacity(scrollY)).toBeCloseTo(opacity);
  });
});

describe('layout hooks', () => {
  it('useHeaderHeight adds the top safe area', async () => {
    const { result } = await renderHook(() => ({ height: useHeaderHeight(), insets: useInsets() }));
    expect(result.current.height).toBe(result.current.insets.top + layout.headerHeight);
  });

  it('useListBottomPadding adds the bottom safe area only without a tab bar', async () => {
    const { result } = await renderHook(() => ({
      withTabBar: useListBottomPadding({ hasTabBar: true }),
      withoutTabBar: useListBottomPadding({ hasTabBar: false }),
      insets: useInsets(),
    }));
    expect(result.current.withTabBar).toBe(spacing.xl);
    expect(result.current.withoutTabBar).toBe(result.current.insets.bottom + spacing.xl);
  });
});
