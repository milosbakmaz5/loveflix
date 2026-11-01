import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { iconColors } from '@/theme';

import { StateView } from './StateView';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <StateView>
      <ActivityIndicator color={iconColors.brand} accessibilityLabel={t('common.loading')} />
    </StateView>
  );
}
