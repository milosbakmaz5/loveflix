import { useLocalSearchParams } from 'expo-router';

import { StackPlaceholderScreen } from '@/screens/StackPlaceholderScreen';

export default function SeriesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StackPlaceholderScreen seriesId={id} />;
}
