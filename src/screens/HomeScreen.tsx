import { useState } from 'react';

import { ErrorState, Header, LoadingState, Screen } from '@/components/ui';
import { useHomeFeed } from '@/data';
import { HomeFeedList } from '@/features/home/components/HomeFeedList';
import { HomeHeaderActions } from '@/features/home/components/HomeHeaderActions';
import { HomeLogo } from '@/features/home/components/HomeLogo';
import { buildHomeRows, type GenreFilter } from '@/features/home/utils/homeRows';

export function HomeScreen() {
  const [genre, setGenre] = useState<GenreFilter>('all');
  const home = useHomeFeed();

  return (
    <Screen>
      <Header left={<HomeLogo />} right={<HomeHeaderActions />} />
      {home.isPending && <LoadingState />}
      {home.isError && <ErrorState error={home.error} onRetry={() => void home.refetch()} />}
      {home.isSuccess && (
        <HomeFeedList
          rows={buildHomeRows(home.data.feed, home.data.series, genre)}
          genres={home.data.feed.genres}
          selectedGenre={genre}
          onSelectGenre={setGenre}
        />
      )}
    </Screen>
  );
}
