import { useLocalSearchParams } from 'expo-router';

import { PlayerScreen } from '@/screens/PlayerScreen';

export default function WatchRoute() {
  const { seriesId, episode } = useLocalSearchParams<{ seriesId: string; episode?: string }>();
  return <PlayerScreen seriesId={seriesId} episodeParam={episode} />;
}
