import { useAtomValue } from 'jotai';

import { DEMO_CONFIG } from '@/config/demo';
import { buildUnlockOptions, type Episode, type MembershipPlan, type UnlockOption } from '@/domain';
import { entitlementsAtom } from '@/state';

import { getSheetOptions } from '../utils/getSheetOptions';

type UnlockOptionsInput = {
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  plans: readonly MembershipPlan[];
};

/** What can be bought for this episode right now, as offered on the unlock card. */
export function useUnlockOptions({
  episode,
  seasonEpisodes,
  plans,
}: UnlockOptionsInput): UnlockOption[] {
  const entitlements = useAtomValue(entitlementsAtom);
  return getSheetOptions(
    buildUnlockOptions({
      episode,
      seasonEpisodes,
      entitlements,
      plans,
      seasonDiscountRate: DEMO_CONFIG.seasonDiscountRate,
    }),
  );
}
