import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ComponentProps } from 'react';

import { TabBar } from '../TabBar';

type TabBarProps = ComponentProps<typeof TabBar>;

const routes = ['(home)', 'discover', 'romance', 'library', 'profile'].map((name) => ({
  name,
  key: `${name}-key`,
  params: undefined,
}));

function setup(index = 0, defaultPrevented = false) {
  const emit = jest.fn(() => ({ defaultPrevented }));
  const navigateToTab = jest.fn();
  // The navigator's props are large; the tab bar reads only these.
  const props = {
    state: { index, routes },
    emitter: { emit },
    navigateToTab,
    insets: { top: 0, bottom: 34, left: 0, right: 0 },
  } as unknown as TabBarProps;
  return { props, emit, navigateToTab };
}

describe('TabBar', () => {
  it('shows every tab and announces the active one', async () => {
    const { props } = setup(1);
    await render(<TabBar {...props} />);

    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByRole('tab', { name: 'Discover' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Home' })).not.toBeSelected();
  });

  it('navigates to the pressed tab', async () => {
    const { props, emit, navigateToTab } = setup();
    await render(<TabBar {...props} />);

    await fireEvent.press(screen.getByRole('tab', { name: 'Profile' }));

    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ target: 'profile-key' }));
    expect(navigateToTab).toHaveBeenCalledWith('profile-key');
  });

  it('does not navigate when already active or when the press is prevented', async () => {
    const active = setup();
    await render(<TabBar {...active.props} />);
    await fireEvent.press(screen.getByRole('tab', { name: 'Home' }));
    expect(active.navigateToTab).not.toHaveBeenCalled();

    const prevented = setup(0, true);
    await render(<TabBar {...prevented.props} />);
    await fireEvent.press(screen.getByRole('tab', { name: 'Library' }));
    expect(prevented.navigateToTab).not.toHaveBeenCalled();
  });
});
