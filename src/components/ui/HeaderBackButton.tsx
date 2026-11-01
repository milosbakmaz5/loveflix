import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { IconButton } from './IconButton';

/** Standard `left` slot for a `secondary` Header. */
export function HeaderBackButton() {
  const { t } = useTranslation();
  return (
    <IconButton
      icon={ChevronLeft}
      variant="ghost"
      accessibilityLabel={t('common.back')}
      onPress={() => router.back()}
    />
  );
}
