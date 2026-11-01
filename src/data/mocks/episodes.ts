import { DEMO_CONFIG } from '@/config/demo';
import type { Episode, EpisodeAccess, ImageRef, Series } from '@/domain';

import { images, VIDEO_SOURCES } from './media';
import { SERIES_IDS } from './series';

const TITLE_POOL = [
  'Unmasking the Truth',
  'Coffee and Contracts',
  'A Glimpse Behind the Mask',
  'The Gala Encounter',
  'The Golden Key',
  "The Locket's Clue",
  'Midnight Confessions',
  'Misunderstandings',
  'The Hidden Ledger',
  'A Dangerous Bargain',
  'Broken Vows',
  'The Final Offer',
  'Rain on the Terrace',
  'A Name in the Will',
  'The Second Envelope',
  'Ashes and Roses',
] as const;

// "The Billionaire's Secret" has its own artwork for these episodes in the design.
const BILLIONAIRES_SECRET_THUMBNAILS: Readonly<Record<number, ImageRef>> = {
  1: images.episodes.billionairesSecret1,
  5: images.episodes.billionairesSecret5,
  6: images.episodes.billionairesSecret6,
};

// Every episode in the design shows the same counts.
const DESIGN_LIKE_COUNT = 12000;
const DESIGN_COMMENT_COUNT = 342;

function cycle<T>(items: readonly T[], index: number): T {
  const item = items[index % items.length];
  if (item === undefined) {
    throw new RangeError('cycle() needs a non-empty list');
  }
  return item;
}

function accessFor(episodeNumber: number): EpisodeAccess {
  return episodeNumber <= DEMO_CONFIG.freeEpisodeCount
    ? { type: 'free' }
    : { type: 'coins', price: DEMO_CONFIG.episodePriceCoins };
}

function thumbnailFor(series: Series, episodeNumber: number): ImageRef {
  if (series.id !== SERIES_IDS.billionairesSecret) {
    return series.heroImage;
  }
  const thumbnails = Object.values(BILLIONAIRES_SECRET_THUMBNAILS);
  return BILLIONAIRES_SECRET_THUMBNAILS[episodeNumber] ?? cycle(thumbnails, episodeNumber);
}

/** Deterministic duration around the series' minutes-per-episode (±20 s). */
function durationFor(series: Series, episodeNumber: number): number {
  const base = Math.round(series.minutesPerEpisode * 60);
  return base + ((episodeNumber * 37) % 41) - 20;
}

export function createEpisodes(series: Series): Episode[] {
  return Array.from({ length: series.episodeCount }, (_, index) => {
    const number = index + 1;
    return {
      id: `${series.id}-e${number}`,
      seriesId: series.id,
      number,
      title: cycle(TITLE_POOL, index),
      durationSec: durationFor(series, number),
      thumbnail: thumbnailFor(series, number),
      video: cycle(VIDEO_SOURCES, index),
      access: accessFor(number),
      likeCount: DESIGN_LIKE_COUNT,
      commentCount: DESIGN_COMMENT_COUNT,
    };
  });
}
