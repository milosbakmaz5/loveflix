import { CloudOff, SearchX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

// Only the error type: importing '@/data' would pull the repositories into the UI kit.
import { isRepositoryError } from '@/data/repositories/errors';

import { Button } from './Button';
import { Icon } from './Icon';
import { StateView } from './StateView';
import { Text } from './Text';

type ErrorStateProps = {
  /** The query error; decides between "not found" and "couldn't load". */
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  const isNotFound = isRepositoryError(error) && error.kind === 'notFound';

  return (
    <StateView>
      <Icon icon={isNotFound ? SearchX : CloudOff} size="lg" color="secondary" />
      <Text variant="body" color="secondary" align="center" accessibilityRole="alert">
        {t(isNotFound ? 'states.notFound' : 'states.error')}
      </Text>
      {/* Retrying cannot bring back something that doesn't exist. */}
      {onRetry && !isNotFound && (
        <Button label={t('common.retry')} onPress={onRetry} variant="secondary" size="md" />
      )}
    </StateView>
  );
}
