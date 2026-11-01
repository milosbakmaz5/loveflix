import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { EmptyState, useListBottomPadding } from '@/components/ui';
import type { Genre } from '@/domain';

import {
  EMPTY_ROW_HEIGHT,
  type GenreFilter,
  getFooterHeight,
  type HomeRow,
} from '../utils/homeRows';
import { CategoryHeading } from './CategoryHeading';
import { GenreFilterBar } from './GenreFilterBar';
import { HeroSpotlight } from './HeroSpotlight';
import { SeriesRail } from './SeriesRail';

type HomeFeedListProps = {
  rows: readonly HomeRow[];
  genres: readonly Genre[];
  selectedGenre: GenreFilter;
  onSelectGenre: (genre: GenreFilter) => void;
};

function getRowKey(row: HomeRow) {
  return row.id;
}

function getRowType(row: HomeRow) {
  return row.type;
}

/** The screen's one vertical scroll. The genre bar is a row so FlashList can pin it. */
export function HomeFeedList({ rows, genres, selectedGenre, onSelectGenre }: HomeFeedListProps) {
  const { t } = useTranslation();
  const listRef = useRef<FlashListRef<HomeRow>>(null);
  const isBarPinned = useRef(false);
  const keepBarPinned = useRef(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const bottomPadding = useListBottomPadding({ hasTabBar: true });
  const barIndex = rows.findIndex((row) => row.type === 'genreFilter');
  const filterOptions: readonly GenreFilter[] = ['all', ...genres];

  // A new filter while pinned: start the results right below the bar. The pinned state is read
  // at tap time and the scroll waits for layout, because a shorter list first clamps the offset.
  useEffect(() => {
    if (!keepBarPinned.current) {
      return;
    }
    keepBarPinned.current = false;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        // Not scrollToIndex: it clamps to the rows' height and ignores the footer filler.
        const barLayout = listRef.current?.getLayout(barIndex);
        if (barLayout) {
          listRef.current?.scrollToOffset({ offset: barLayout.y, animated: false });
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedGenre, barIndex]);

  function handleSelectGenre(genre: GenreFilter) {
    keepBarPinned.current = isBarPinned.current;
    onSelectGenre(genre);
  }

  function renderRow({ item }: { item: HomeRow }) {
    switch (item.type) {
      case 'hero':
        return <HeroSpotlight series={item.series} />;
      case 'genreFilter':
        return (
          <GenreFilterBar
            genres={filterOptions}
            selected={selectedGenre}
            onSelect={handleSelectGenre}
          />
        );
      case 'category':
        return <CategoryHeading title={item.title} highlighted={item.highlighted} />;
      case 'rail':
        return <SeriesRail title={item.title} series={item.series} />;
      case 'empty':
        return (
          <View style={styles.empty}>
            <EmptyState message={t('home.noSeries')} />
          </View>
        );
      default: {
        const _exhaustive: never = item;
        return _exhaustive;
      }
    }
  }

  return (
    <View
      style={styles.container}
      onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
    >
      <FlashList
        ref={listRef}
        data={rows}
        extraData={selectedGenre}
        renderItem={renderRow}
        keyExtractor={getRowKey}
        getItemType={getRowType}
        stickyHeaderIndices={[barIndex]}
        // Filtering replaces the rows; the pinned-bar scroll above decides the position instead.
        maintainVisibleContentPosition={{ disabled: true }}
        onChangeStickyIndex={(current) => {
          isBarPinned.current = current === barIndex;
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ height: getFooterHeight(rows, viewportHeight, bottomPadding) }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    height: EMPTY_ROW_HEIGHT,
  },
});
