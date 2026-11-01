import { fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { VideoProgressBar } from '../VideoProgressBar';

const handlers = { onScrubStart: jest.fn(), onScrubEnd: jest.fn(), onSeekBy: jest.fn() };

async function renderBar() {
  const { result } = await renderHook(() => ({
    currentTime: useSharedValue(0),
    duration: useSharedValue(15),
  }));
  await render(<VideoProgressBar {...result.current} {...handlers} />, {
    wrapper: GestureHandlerRootView,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('VideoProgressBar', () => {
  it('is an adjustable control with the current time as its value', async () => {
    await renderBar();

    expect(screen.getByRole('adjustable', { name: 'Playback position' })).toHaveAccessibilityValue({
      text: '0:00',
    });
  });

  it('adjusts by the skip step for screen readers', async () => {
    await renderBar();
    const bar = screen.getByRole('adjustable', { name: 'Playback position' });

    await fireEvent(bar, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(handlers.onSeekBy).toHaveBeenLastCalledWith(10);

    await fireEvent(bar, 'accessibilityAction', { nativeEvent: { actionName: 'decrement' } });
    expect(handlers.onSeekBy).toHaveBeenLastCalledWith(-10);
  });
});
