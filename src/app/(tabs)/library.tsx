import { useTranslation } from 'react-i18next';

import { TabPlaceholderScreen } from '@/screens/TabPlaceholderScreen';

export default function LibraryRoute() {
  const { t } = useTranslation();
  return <TabPlaceholderScreen title={t('tabs.library')} />;
}
