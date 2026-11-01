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

import '@shopify/flash-list/jestSetup';
import '@/lib/i18n';
