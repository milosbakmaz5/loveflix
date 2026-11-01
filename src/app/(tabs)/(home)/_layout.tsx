import { Stack } from 'expo-router';

import { backgroundColors } from '@/theme';

// A deep link into a series still has Home to go back to.
export const unstable_settings = { initialRouteName: 'index' };

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: backgroundColors.screen },
      }}
    />
  );
}
