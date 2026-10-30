import type { CastMember, Series, SeriesId } from '@/domain';

import { images } from './media';

export const SERIES_IDS = {
  billionairesSecret: 'billionaires-secret',
  echoesOfEternity: 'echoes-of-eternity',
  theCeoAndI: 'the-ceo-and-i',
  mySecretLife: 'my-secret-life',
  loveOnDetours: 'love-on-detours',
  forbiddenLove: 'forbidden-love',
  bloodyRoses: 'bloody-roses',
  shadowKiss: 'shadow-kiss',
  darkDesire: 'dark-desire',
  avengingAngel: 'avenging-angel',
  bandOfFate: 'band-of-fate',
  secondChance: 'second-chance',
} as const satisfies Record<string, SeriesId>;

const billionairesSecretCast: readonly CastMember[] = [
  { id: 'alexander-sterling', name: 'Alexander Sterling', role: 'The Billionaire' },
  { id: 'elena-hart', name: 'Elena Hart', role: 'The Assistant' },
  { id: 'julian-vance', name: 'Julian Vance', role: 'The Rival' },
  { id: 'sarah-lin', name: 'Sarah Lin', role: 'Best Friend' },
];

const echoesCast: readonly CastMember[] = [
  { id: 'isolde-black', name: 'Isolde Black', role: 'The Heiress' },
  { id: 'marcus-vale', name: 'Marcus Vale', role: 'The CEO' },
  { id: 'mia-winters', name: 'Mia Winters', role: 'The Rival' },
];

type SeriesSeed = Omit<Series, 'heroImage' | 'cast' | 'highlights' | 'tags'> &
  Partial<Pick<Series, 'heroImage' | 'cast' | 'highlights' | 'tags'>>;

function series(seed: SeriesSeed): Series {
  return {
    heroImage: seed.posterImage,
    cast: [],
    highlights: [],
    tags: [],
    ...seed,
  };
}

export const seriesCatalog: readonly Series[] = [
  series({
    id: SERIES_IDS.billionairesSecret,
    title: "The Billionaire's Secret",
    tagline: 'Every fortune hides a confession.',
    synopsis:
      'When assistant Elena Hart opens a confidential envelope meant for her boss, she uncovers the secret that could topple the Sterling empire — and the man who built it. Now she must decide whether to expose him or protect him, as the line between loyalty and love begins to blur.',
    genres: ['billionaire', 'romance', 'drama'],
    tags: ['Billionaire', 'Secret Identity', 'Romance'],
    rating: 4.8,
    ratingCount: 12_000,
    year: 2024,
    episodeCount: 45,
    minutesPerEpisode: 2,
    isPro: false,
    posterImage: images.episodes.billionairesSecret1,
    heroImage: images.episodes.billionairesSecret1,
    cast: billionairesSecretCast,
    highlights: [
      'Intense chemistry from the very first frame.',
      'A gripping double-life narrative with high stakes.',
    ],
  }),
  series({
    id: SERIES_IDS.echoesOfEternity,
    title: 'Echoes of Eternity',
    tagline: "A CEO's dangerous secret contract.",
    synopsis:
      'On a rain-soaked night in the old city, a reluctant heiress signs a contract with a mysterious CEO. The terms are simple — until the past they share starts to surface, one red rose at a time.',
    genres: ['romance', 'drama', 'billionaire'],
    tags: ['Romance', 'Drama', 'Billionaire'],
    rating: 4.8,
    ratingCount: 8_400,
    year: 2025,
    episodeCount: 72,
    minutesPerEpisode: 2,
    isPro: false,
    posterImage: images.heroes.echoesOfEternity,
    cast: echoesCast,
    highlights: ['A slow-burn romance wrapped in gothic mystery.'],
  }),
  series({
    id: SERIES_IDS.theCeoAndI,
    title: 'The CEO and I',
    tagline: 'A forbidden empire. A dangerous love.',
    synopsis:
      'A junior analyst catches the eye of the most feared CEO in the city — and finds herself at the centre of a corporate war.',
    genres: ['billionaire', 'romance'],
    rating: 4.7,
    ratingCount: 9_100,
    year: 2024,
    episodeCount: 50,
    minutesPerEpisode: 2,
    isPro: true,
    posterImage: images.posters.theCeoAndI,
  }),
  series({
    id: SERIES_IDS.mySecretLife,
    title: 'My Secret Life',
    tagline: 'A thriller of masks and lies.',
    synopsis:
      'By day she is a quiet archivist. By night she is the city’s most wanted informant — until the man hunting her falls for the woman she pretends to be.',
    genres: ['mystery', 'drama'],
    rating: 4.5,
    ratingCount: 5_300,
    year: 2023,
    episodeCount: 30,
    minutesPerEpisode: 1,
    isPro: false,
    posterImage: images.posters.mySecretLife,
  }),
  series({
    id: SERIES_IDS.loveOnDetours,
    title: 'Love on Detours',
    tagline: 'Some roads lead back to you.',
    synopsis:
      'Two strangers keep missing each other across a summer of wrong turns, missed trains and one very stubborn hourglass.',
    genres: ['romance'],
    rating: 4.6,
    ratingCount: 6_800,
    year: 2025,
    episodeCount: 65,
    minutesPerEpisode: 2,
    isPro: true,
    posterImage: images.posters.loveOnDetours,
  }),
  series({
    id: SERIES_IDS.forbiddenLove,
    title: 'Forbidden Love',
    tagline: 'Two houses. One impossible vow.',
    synopsis:
      'The daughter of a disgraced family and the heir of their sworn enemies meet beneath the castle arches — and neither can walk away.',
    genres: ['romance', 'historical'],
    rating: 4.7,
    ratingCount: 7_200,
    year: 2024,
    episodeCount: 40,
    minutesPerEpisode: 2,
    isPro: false,
    posterImage: images.posters.forbiddenLove,
  }),
  series({
    id: SERIES_IDS.bloodyRoses,
    title: 'Bloody Roses',
    tagline: 'Every rose has its price.',
    synopsis:
      'A florist who delivers roses to the city’s elite starts finding messages hidden in the orders — and one of them is meant for her.',
    genres: ['mystery', 'romance'],
    rating: 4.4,
    ratingCount: 4_100,
    year: 2023,
    episodeCount: 80,
    minutesPerEpisode: 2,
    isPro: true,
    posterImage: images.posters.bloodyRoses,
  }),
  series({
    id: SERIES_IDS.shadowKiss,
    title: 'Shadow Kiss',
    tagline: 'A forbidden love story that defies the darkness.',
    synopsis:
      'She can see the shadows that follow everyone. His is the only one that ever looked back.',
    genres: ['fantasy', 'romance'],
    rating: 4.6,
    ratingCount: 5_900,
    year: 2024,
    episodeCount: 45,
    minutesPerEpisode: 1.5,
    isPro: false,
    posterImage: images.posters.shadowKiss,
  }),
  series({
    id: SERIES_IDS.darkDesire,
    title: 'Dark Desire',
    tagline: 'A thriller of consuming passion.',
    synopsis:
      'An affair that should have stayed secret becomes the alibi in a murder case — and the only witness is the lover she swore she never knew.',
    genres: ['drama', 'mystery'],
    rating: 4.3,
    ratingCount: 3_700,
    year: 2022,
    episodeCount: 60,
    minutesPerEpisode: 2,
    isPro: true,
    posterImage: images.posters.darkDesire,
  }),
  series({
    id: SERIES_IDS.avengingAngel,
    title: 'Avenging Angel',
    tagline: 'Heaven sent her. Revenge keeps her.',
    synopsis:
      'A fallen guardian returns to the city she once protected to settle a debt with the man who clipped her wings.',
    genres: ['action', 'fantasy'],
    rating: 4.5,
    ratingCount: 10_200,
    year: 2025,
    episodeCount: 90,
    minutesPerEpisode: 2.5,
    isPro: true,
    posterImage: images.posters.avengingAngel,
  }),
  series({
    id: SERIES_IDS.bandOfFate,
    title: 'Band of Fate',
    tagline: 'Bound by a promise older than time.',
    synopsis:
      'Seven hooded keepers, one ancient tree and a vow that ties two strangers together across lifetimes.',
    genres: ['fantasy', 'romance'],
    rating: 4.4,
    ratingCount: 2_900,
    year: 2024,
    episodeCount: 25,
    minutesPerEpisode: 1,
    isPro: false,
    posterImage: images.posters.bandOfFate,
  }),
  series({
    id: SERIES_IDS.secondChance,
    title: 'Second Chance',
    tagline: 'A new dawn. A new path.',
    synopsis:
      'Ten years after walking away, he comes back to the city that broke him — and to the woman who never stopped waiting.',
    genres: ['romance', 'drama'],
    rating: 4.6,
    ratingCount: 6_100,
    year: 2023,
    episodeCount: 55,
    minutesPerEpisode: 2,
    isPro: true,
    posterImage: images.posters.secondChance,
  }),
];
