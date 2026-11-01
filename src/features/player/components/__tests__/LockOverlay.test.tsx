import { fireEvent, render, screen } from '@testing-library/react-native';

import { LockOverlay } from '../LockOverlay';

describe('LockOverlay', () => {
  it('names the episode and opens the unlock flow', async () => {
    const onUnlock = jest.fn();
    await render(<LockOverlay episodeNumber={5} onUnlock={onUnlock} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Unlock Episode 5' }));

    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});
