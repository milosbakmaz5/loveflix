import { CreditCard, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { backgroundColors, borderColors, layout, spacing } from '@/theme';

import type { StoreItem } from '../hooks/useCoinStore';

type PurchaseFooterProps = {
  item: StoreItem;
  isBuying: boolean;
  hasPaymentFailed: boolean;
  onBuy: () => void;
};

export function PurchaseFooter({ item, isBuying, hasPaymentFailed, onBuy }: PurchaseFooterProps) {
  const { t, i18n } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const isPack = item.type === 'pack';
  const price = formatPrice(isPack ? item.pack.price : item.plan.price, i18n.language);

  return (
    <View style={[styles.footer, { paddingBottom: bottom + spacing.xs }]}>
      <View style={styles.assurances}>
        <View style={styles.assurance}>
          <Icon icon={ShieldCheck} size="sm" color="secondary" />
          <Text variant="caption" color="secondary">
            {t('store.secure')}
          </Text>
        </View>
        <View style={styles.assurance}>
          <Icon icon={CreditCard} size="sm" color="secondary" />
          <Text variant="caption" color="secondary">
            {t('store.appStorePay')}
          </Text>
        </View>
      </View>
      {hasPaymentFailed && (
        <Text variant="bodySmall" color="secondary" align="center" accessibilityRole="alert">
          {t('store.paymentFailed')}
        </Text>
      )}
      <Button
        variant="premium"
        shape="rounded"
        fullWidth
        haptic
        loading={isBuying}
        label={isPack ? t('store.buyCoins', { coins: item.pack.coins }) : t('store.startVip')}
        sublabel={
          isPack
            ? t('store.forPrice', { price })
            : t(`store.forPricePer.${item.plan.period}`, { price })
        }
        onPress={onBuy}
      />
      <Text variant="caption" color="muted" align="center">
        {t('store.legal')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: layout.screenGutter,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: borderColors.default,
    backgroundColor: backgroundColors.surfaceRaised,
  },
  assurances: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  assurance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});
