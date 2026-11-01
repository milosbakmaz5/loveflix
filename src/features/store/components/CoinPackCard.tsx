import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck, Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Icon, Text } from '@/components/ui';
import type { CoinPack, CoinPackBadge } from '@/domain';
import { formatPrice } from '@/lib/format';
import { backgroundColors, gradients, spacing } from '@/theme';

import { PriceTag } from './PriceTag';

type CoinPackCardProps = {
  pack: CoinPack;
  isSelected: boolean;
  onSelect: () => void;
};

function PackBanner({ badge }: { badge: CoinPackBadge }) {
  const { t } = useTranslation();
  const label = (
    <Text variant="badge" color="onBrand" align="center">
      {t(`badges.${badge}`)}
    </Text>
  );

  if (badge === 'bestValue') {
    return (
      <LinearGradient
        colors={gradients.premium}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.banner}
      >
        {label}
      </LinearGradient>
    );
  }
  return <View style={[styles.banner, styles.popularBanner]}>{label}</View>;
}

export function CoinPackCard({ pack, isSelected, onSelect }: CoinPackCardProps) {
  const { t, i18n } = useTranslation();
  const price = formatPrice(pack.price, i18n.language);
  const coins = t('coins.amount', { count: pack.coins });
  const bonus = pack.bonusCoins > 0 ? t('store.bonus', { count: pack.bonusCoins }) : undefined;
  const badge = pack.badge && t(`badges.${pack.badge}`);

  return (
    <Card
      selected={isSelected}
      selectedTone="brand"
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityLabel={[coins, bonus, price, badge].filter(Boolean).join(', ')}
      style={styles.card}
    >
      {pack.badge && <PackBanner badge={pack.badge} />}
      {isSelected && (
        <View style={styles.check}>
          <Icon icon={CircleCheck} size="sm" color="brand" />
        </View>
      )}
      <View style={styles.content}>
        <Icon icon={Zap} size="xl" color="brand" />
        <Text variant="h1">{pack.coins}</Text>
        {/* Always takes its line, so the price tags of a row stay level. */}
        <Text variant="bodySmall" color="accent" style={styles.bonus}>
          {bonus}
        </Text>
        <PriceTag price={price} isSelected={isSelected} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
  },
  popularBanner: {
    backgroundColor: backgroundColors.brand,
  },
  check: {
    position: 'absolute',
    top: spacing.lg + spacing.xxs,
    right: spacing.xs,
  },
  content: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.xl + spacing.xxs,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bonus: {
    minHeight: 18,
    marginBottom: spacing.xs,
  },
});
