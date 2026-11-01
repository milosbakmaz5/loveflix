import { useLocalSearchParams } from 'expo-router';

import { PlayerScreen } from '@/screens/PlayerScreen';

export default function WatchRoute() {
  const { seriesId, episode, autoplay } = useLocalSearchParams<{
    seriesId: string;
    episode?: string;
    autoplay?: string;
  }>();
  return <PlayerScreen seriesId={seriesId} episodeParam={episode} autoplay={autoplay === 'true'} />;
}
