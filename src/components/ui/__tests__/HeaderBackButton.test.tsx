import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { HeaderBackButton } from '../HeaderBackButton';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HeaderBackButton', () => {
  it('goes back when there is a screen behind', async () => {
    jest.mocked(router.canGoBack).mockReturnValue(true);
    await render(<HeaderBackButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('goes to Home when the screen was opened with nothing behind it', async () => {
    jest.mocked(router.canGoBack).mockReturnValue(false);
    await render(<HeaderBackButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));

    expect(router.replace).toHaveBeenCalledWith('/');
    expect(router.back).not.toHaveBeenCalled();
  });
});
