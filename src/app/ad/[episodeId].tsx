import { useLocalSearchParams } from 'expo-router';

import { AdScreen } from '@/screens/AdScreen';

export default function AdRoute() {
  const { episodeId } = useLocalSearchParams<{ episodeId: string }>();
  return <AdScreen episodeId={episodeId} />;
}
