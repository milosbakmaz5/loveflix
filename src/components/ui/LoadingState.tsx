import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { iconColors } from '@/theme';

import { StateView } from './StateView';
import { Text } from './Text';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  const { t } = useTranslation();
  return (
    <StateView>
      <ActivityIndicator
        color={iconColors.brand}
        accessibilityLabel={message ?? t('common.loading')}
      />
      {message && (
        <Text variant="bodySmall" color="secondary" align="center">
          {message}
        </Text>
      )}
    </StateView>
  );
}
