import { Crown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import type { MembershipPlan } from '@/domain';
import { formatPrice } from '@/lib/format';
import { backgroundColors, spacing } from '@/theme';

type VipMembershipCardProps = {
  plan: MembershipPlan;
  isSelected: boolean;
  onSelect: () => void;
};

export function VipMembershipCard({ plan, isSelected, onSelect }: VipMembershipCardProps) {
  const { t, i18n } = useTranslation();
  const price = formatPrice(plan.price, i18n.language);
  const period = t(`store.period.${plan.period}`);

  return (
    <Card
      selected={isSelected}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityLabel={`${t('store.vipTitle')}, ${t('store.vipDetail')}, ${price} ${period}`}
    >
      <View style={styles.row}>
        <View style={styles.crown}>
          <Icon icon={Crown} size="lg" />
        </View>
        <View style={styles.titles}>
          <Text variant="h2">{t('store.vipTitle')}</Text>
          <Text variant="bodySmall" color="secondary">
            {t('store.vipDetail')}
          </Text>
        </View>
        <View style={styles.price}>
          <Text variant="bodyStrong">{price}</Text>
          <Text variant="caption" color="secondary">
            {period}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const CROWN_SIZE = 48;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  crown: {
    width: CROWN_SIZE,
    height: CROWN_SIZE,
    borderRadius: CROWN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColors.screen,
  },
  titles: {
    flex: 1,
  },
  price: {
    alignItems: 'flex-end',
  },
});
