import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';

import { VideoGestureSurface } from '../VideoGestureSurface';

const handlers = { onTogglePause: jest.fn(), onSeekBy: jest.fn() };

async function renderSurface() {
  await render(<VideoGestureSurface isPaused={false} {...handlers} />, {
    wrapper: GestureHandlerRootView,
  });
}

// Jest's default window is 750 wide, so the halves split at 375.
async function doubleTapAt(x: number) {
  await act(async () => {
    fireGestureHandler(getByGestureTestId('video-double-tap'), [{ state: State.ACTIVE, x }]);
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('VideoGestureSurface', () => {
  it('skips back from a double tap on the left half', async () => {
    await renderSurface();

    await doubleTapAt(100);

    expect(handlers.onSeekBy).toHaveBeenCalledWith(-10);
    expect(handlers.onTogglePause).not.toHaveBeenCalled();
  });

  it('skips forward from a double tap on the right half', async () => {
    await renderSurface();

    await doubleTapAt(600);

    expect(handlers.onSeekBy).toHaveBeenCalledWith(10);
  });

  it('pauses from a single tap', async () => {
    await renderSurface();

    await act(async () => {
      fireGestureHandler(getByGestureTestId('video-single-tap'), [{ x: 100 }]);
    });

    expect(handlers.onTogglePause).toHaveBeenCalledTimes(1);
    expect(handlers.onSeekBy).not.toHaveBeenCalled();
  });

  it('offers the skips to screen readers as actions', async () => {
    await renderSurface();

    await fireEvent(screen.getByRole('button', { name: 'Pause' }), 'accessibilityAction', {
      nativeEvent: { actionName: 'rewind' },
    });

    expect(handlers.onSeekBy).toHaveBeenCalledWith(-10);
  });
});
