import { Redirect } from 'expo-router';

import { KitchenSinkScreen } from '@/features/dev/KitchenSinkScreen';

// Dev-only: release builds never show the UI kit catalogue.
export default function KitchenSinkRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return <KitchenSinkScreen />;
}
