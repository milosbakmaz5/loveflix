import { useTranslation } from 'react-i18next';

import { TabPlaceholderScreen } from '@/screens/TabPlaceholderScreen';

export default function RomanceRoute() {
  const { t } = useTranslation();
  return <TabPlaceholderScreen title={t('tabs.romance')} />;
}
