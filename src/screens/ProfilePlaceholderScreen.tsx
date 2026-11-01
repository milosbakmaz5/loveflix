import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { resetDemoAtom } from '@/state';

import { TabPlaceholderScreen } from './TabPlaceholderScreen';

export function ProfilePlaceholderScreen() {
  const { t } = useTranslation();
  const resetDemo = useSetAtom(resetDemoAtom);
  return (
    <TabPlaceholderScreen title={t('tabs.profile')}>
      <Button label={t('profile.resetDemo')} variant="secondary" size="md" onPress={resetDemo} />
    </TabPlaceholderScreen>
  );
}
