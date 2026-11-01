import { useTranslation } from 'react-i18next';

import { EmptyState, Header, HeaderBackButton, Screen } from '@/components/ui';

/** Stands in for the coin store until that step replaces it. */
export function StorePlaceholderScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Header variant="secondary" left={<HeaderBackButton />} />
      <EmptyState message={t('common.comingSoon')} />
    </Screen>
  );
}
