import type { ImageRef } from '@/domain';

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

// Public HLS test streams (verified reachable). Episodes cycle through them.
export const VIDEO_SOURCES = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://test-streams.mux.dev/tos_ismc/main.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
] as const;
