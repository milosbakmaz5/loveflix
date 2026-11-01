import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { IconButton } from './IconButton';

function goBack() {
  // A screen opened from a link can have nothing behind it.
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

/** Standard `left` slot for a `secondary` Header. */
export function HeaderBackButton() {
  const { t } = useTranslation();
  return (
    <IconButton
      icon={ChevronLeft}
      variant="filled"
      accessibilityLabel={t('common.back')}
      onPress={goBack}
    />
  );
}
