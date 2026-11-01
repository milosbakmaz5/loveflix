import type { ImageRef, VideoRef } from '@/domain';

// Artwork exported from the Figma design (original source images, resized for phones).
export const images = {
  posters: {
    theCeoAndI: require('../../../assets/images/posters/the-ceo-and-i.jpg'),
    mySecretLife: require('../../../assets/images/posters/my-secret-life.jpg'),
    loveOnDetours: require('../../../assets/images/posters/love-on-detours.jpg'),
    bloodyRoses: require('../../../assets/images/posters/bloody-roses.jpg'),
    shadowKiss: require('../../../assets/images/posters/shadow-kiss.jpg'),
    darkDesire: require('../../../assets/images/posters/dark-desire.jpg'),
    forbiddenLove: require('../../../assets/images/posters/forbidden-love.jpg'),
    avengingAngel: require('../../../assets/images/posters/avenging-angel.jpg'),
    bandOfFate: require('../../../assets/images/posters/band-of-fate.jpg'),
    secondChance: require('../../../assets/images/posters/second-chance.jpg'),
  },
  heroes: {
    echoesOfEternity: require('../../../assets/images/heroes/echoes-of-eternity.jpg'),
  },
  episodes: {
    billionairesSecret1: require('../../../assets/images/episodes/billionaires-secret-1.jpg'),
    billionairesSecret5: require('../../../assets/images/episodes/billionaires-secret-5.jpg'),
    billionairesSecret6: require('../../../assets/images/episodes/billionaires-secret-6.jpg'),
  },
  profile: {
    avatar: require('../../../assets/images/profile/avatar.jpg'),
  },
} as const satisfies Record<string, Record<string, ImageRef>>;

// Placeholder clips made from the design's episode artwork, bundled so playback needs no network.
// Episodes cycle through them.
export const VIDEO_SOURCES = [
  require('../../../assets/videos/clip-1.mp4'),
  require('../../../assets/videos/clip-2.mp4'),
  require('../../../assets/videos/clip-3.mp4'),
] as const satisfies readonly VideoRef[];
