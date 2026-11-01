import { useTranslation } from 'react-i18next';

import {
  EmptyState,
  ErrorState,
  Header,
  HeaderBackButton,
  LoadingState,
  Screen,
} from '@/components/ui';
import { useSeries } from '@/data';
import type { SeriesId } from '@/domain';

type StackPlaceholderScreenProps = {
  seriesId: SeriesId;
};

/** Stands in for Series detail and the Player until those steps replace it. */
export function StackPlaceholderScreen({ seriesId }: StackPlaceholderScreenProps) {
  const { t } = useTranslation();
  const series = useSeries(seriesId);

  return (
    <Screen>
      <Header variant="secondary" left={<HeaderBackButton />} title={series.data?.title} />
      {series.isPending && <LoadingState />}
      {series.isError && <ErrorState error={series.error} onRetry={() => void series.refetch()} />}
      {series.isSuccess && <EmptyState message={t('common.comingSoon')} />}
    </Screen>
  );
}
