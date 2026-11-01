// react-native-mmkv loads its native Nitro module on import, which doesn't exist under Jest.
// Swap in the library's own in-memory mock (one Map per instance).
jest.mock('react-native-mmkv', () => {
  const { createMockMMKV } = jest.requireActual<
    typeof import('react-native-mmkv/lib/createMMKV/createMockMMKV')
  >('react-native-mmkv/lib/createMMKV/createMockMMKV');
  return { createMMKV: createMockMMKV };
});

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

// expo-video needs its native module; tests drive a fake player instead.
jest.mock('expo-video', () => jest.requireActual('@/test/fakeExpoVideo'));

// Gesture Handler asks Worklets for the native UI runtime on load, which doesn't exist under Jest.
jest.mock('react-native-worklets', () => ({
  ...jest.requireActual<typeof import('react-native-worklets')>('react-native-worklets'),
  getUIRuntimeHolder: () => ({}),
}));

import 'react-native-gesture-handler/jestSetup';
import '@shopify/flash-list/jestSetup';
import '@/lib/i18n';
