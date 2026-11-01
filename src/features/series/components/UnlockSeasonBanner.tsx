import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Card, PressableScale, Text } from '@/components/ui';
import { DEMO_CONFIG } from '@/config/demo';
import type { Episode, Money } from '@/domain';
import { formatPrice } from '@/lib/format';
import { backgroundColors, iconColors, layout, radii, spacing } from '@/theme';

import { useSeasonPurchase } from '../hooks/useSeasonPurchase';

type UnlockSeasonBannerProps = {
  episodes: readonly Episode[];
  price: Money;
};

export function UnlockSeasonBanner({ episodes, price }: UnlockSeasonBannerProps) {
  const { t, i18n } = useTranslation();
  const { isAvailable, buy, isBuying, hasFailed } = useSeasonPurchase(episodes);
  const formattedPrice = formatPrice(price, i18n.language);

  if (!isAvailable) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.titles}>
            <Text variant="h3">{t('unlock.seasonOption')}</Text>
            <Text variant="bodySmall" color="secondary">
              {t('series.seasonSavings', {
                percent: Math.round(DEMO_CONFIG.seasonDiscountRate * 100),
              })}
            </Text>
          </View>
          <PressableScale
            haptic
            disabled={isBuying}
            accessibilityRole="button"
            accessibilityLabel={t('series.buySeason', { price: formattedPrice })}
            accessibilityState={{ busy: isBuying }}
            hitSlop={spacing.xxs}
            onPress={buy}
          >
            <View style={styles.pill}>
              {isBuying ? (
                <ActivityIndicator size="small" color={iconColors.onBrand} />
              ) : (
                <Text variant="bodyStrong" color="onBrand">
                  {formattedPrice}
                </Text>
              )}
            </View>
          </PressableScale>
        </View>
        {hasFailed && (
          <Text
            variant="bodySmall"
            color="secondary"
            accessibilityRole="alert"
            style={styles.failure}
          >
            {t('store.paymentFailed')}
          </Text>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: layout.screenGutter,
  },
  card: {
    backgroundColor: backgroundColors.accentSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titles: {
    flex: 1,
  },
  pill: {
    minWidth: 76,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: backgroundColors.accent,
  },
  failure: {
    marginTop: spacing.xs,
  },
});
