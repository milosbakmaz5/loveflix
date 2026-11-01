import { useTranslation } from 'react-i18next';

import { EmptyState, Screen } from '@/components/ui';

/** Stands in for the unlock sheet until that step replaces it. */
export function UnlockPlaceholderScreen() {
  const { t } = useTranslation();

  return (
    <Screen edges={['bottom']}>
      <EmptyState message={t('common.comingSoon')} />
    </Screen>
  );
}
