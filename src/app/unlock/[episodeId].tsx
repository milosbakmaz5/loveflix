import { useLocalSearchParams } from 'expo-router';

import { UnlockScreen } from '@/screens/UnlockScreen';

export default function UnlockRoute() {
  const { episodeId, seriesId } = useLocalSearchParams<{ episodeId: string; seriesId: string }>();
  return <UnlockScreen episodeId={episodeId} seriesId={seriesId} />;
}
