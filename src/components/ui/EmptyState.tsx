import { Inbox } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from './Icon';
import { StateView } from './StateView';
import { Text } from './Text';

type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <StateView>
      <Icon icon={Inbox} size="lg" color="secondary" />
      <Text variant="body" color="secondary" align="center">
        {message ?? t('states.empty')}
      </Text>
    </StateView>
  );
}
