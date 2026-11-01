import { useLocalSearchParams } from 'expo-router';

import { SeriesDetailScreen } from '@/screens/SeriesDetailScreen';

export default function SeriesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SeriesDetailScreen seriesId={id} />;
}
