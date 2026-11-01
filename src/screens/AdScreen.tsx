import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Header, IconButton, Screen } from '@/components/ui';
import type { EpisodeId } from '@/domain';
import { AdCountdown } from '@/features/ad/components/AdCountdown';
import { MockAdCreative } from '@/features/ad/components/MockAdCreative';
import { useRewardedAd } from '@/features/ad/hooks/useRewardedAd';

type AdScreenProps = {
  episodeId: EpisodeId;
};

export function AdScreen({ episodeId }: AdScreenProps) {
  const { t } = useTranslation();
  const { secondsLeft, close } = useRewardedAd({ episodeId });

  return (
    <Screen>
      <Header
        variant="secondary"
        title={t('ad.title')}
        right={
          <IconButton
            icon={X}
            variant="filled"
            accessibilityLabel={t('common.close')}
            onPress={close}
          />
        }
      />
      <MockAdCreative />
      <AdCountdown secondsLeft={secondsLeft} />
    </Screen>
  );
}
