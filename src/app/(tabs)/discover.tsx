import { useTranslation } from 'react-i18next';

import { TabPlaceholderScreen } from '@/screens/TabPlaceholderScreen';

export default function DiscoverRoute() {
  const { t } = useTranslation();
  return <TabPlaceholderScreen title={t('tabs.discover')} />;
}
