import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Chip } from '@/components/ui';
import { backgroundColors, layout, spacing } from '@/theme';

import { genreBarOffsetAtom } from '../state/genreBarOffset.atom';
import { GENRE_BAR_HEIGHT, type GenreFilter } from '../utils/homeRows';

type GenreFilterBarProps = {
  genres: readonly GenreFilter[];
  selected: GenreFilter;
  onSelect: (genre: GenreFilter) => void;
};

export function GenreFilterBar({ genres, selected, onSelect }: GenreFilterBarProps) {
  const { t } = useTranslation();
  const [offset, setOffset] = useAtom(genreBarOffsetAtom);

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setOffset(event.nativeEvent.contentOffset.x);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentOffset={{ x: offset, y: 0 }}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
      // Solid: posters scroll underneath while the bar is pinned.
      style={styles.bar}
      contentContainerStyle={styles.content}
    >
      {genres.map((genre) => (
        <Chip
          key={genre}
          label={t(`genres.${genre}`)}
          selected={genre === selected}
          onPress={() => onSelect(genre)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: GENRE_BAR_HEIGHT,
    flexGrow: 0,
    backgroundColor: backgroundColors.screen,
  },
  content: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: layout.screenGutter,
  },
});
