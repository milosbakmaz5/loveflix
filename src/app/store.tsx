import { useLocalSearchParams } from 'expo-router';

import { StoreScreen } from '@/screens/StoreScreen';

export default function StoreRoute() {
  const { seriesId, episodeId, option } = useLocalSearchParams<{
    seriesId: string;
    episodeId: string;
    option?: string;
  }>();
  return <StoreScreen seriesId={seriesId} episodeId={episodeId} optionParam={option} />;
}
