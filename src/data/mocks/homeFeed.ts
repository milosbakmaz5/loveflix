import type { HomeFeed } from '@/domain';

import { SERIES_IDS } from './series';

export const homeFeed: HomeFeed = {
  spotlightSeriesId: SERIES_IDS.echoesOfEternity,
  genres: ['romance', 'drama', 'billionaire', 'action', 'mystery', 'fantasy'],
  categories: [
    {
      id: 'romance',
      title: 'Romance',
      rails: [
        {
          id: 'trending-romance',
          title: 'Trending Romance',
          seriesIds: [
            SERIES_IDS.billionairesSecret,
            SERIES_IDS.theCeoAndI,
            SERIES_IDS.mySecretLife,
            SERIES_IDS.loveOnDetours,
          ],
        },
        {
          id: 'forbidden-love',
          title: 'Forbidden Love',
          seriesIds: [
            SERIES_IDS.forbiddenLove,
            SERIES_IDS.bloodyRoses,
            SERIES_IDS.shadowKiss,
            SERIES_IDS.darkDesire,
          ],
        },
      ],
    },
    {
      id: 'micro-dramas',
      title: 'Popular Micro Dramas',
      rails: [
        {
          id: 'most-watched',
          title: 'Most Watched',
          seriesIds: [
            SERIES_IDS.avengingAngel,
            SERIES_IDS.bandOfFate,
            SERIES_IDS.secondChance,
            SERIES_IDS.echoesOfEternity,
          ],
        },
      ],
    },
  ],
};
