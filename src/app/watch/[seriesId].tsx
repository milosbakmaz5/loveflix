import { useLocalSearchParams } from 'expo-router';

import { StackPlaceholderScreen } from '@/screens/StackPlaceholderScreen';

export default function WatchRoute() {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  return <StackPlaceholderScreen seriesId={seriesId} />;
}
