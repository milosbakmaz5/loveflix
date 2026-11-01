import type { UnlockOption } from '@/domain';

function isShownInSheet(option: UnlockOption): boolean {
  switch (option.type) {
    case 'episode':
      return true;
    case 'season':
      // With one episode left, this would only repeat the episode row at a discount.
      return option.episodeIds.length > 1;
    case 'membership':
      // The weekly plan is sold in the coin store.
      return option.plan.period === 'month';
    case 'ad':
      return false;
    default: {
      const _exhaustive: never = option;
      return _exhaustive;
    }
  }
}

/** The rows of the unlock sheet, in display order. */
export function getSheetOptions(options: readonly UnlockOption[]): UnlockOption[] {
  return options.filter(isShownInSheet);
}
