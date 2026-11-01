import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, RadioIndicator, Text } from '@/components/ui';
import type { UnlockOption } from '@/domain';
import { formatPrice } from '@/lib/format';
import { backgroundColors, radii, spacing } from '@/theme';

type UnlockOptionRowProps = {
  option: UnlockOption;
  isSelected: boolean;
  onSelect: () => void;
};

type RowCopy = {
  title: string;
  subtitle: string;
  price: string;
};

function useRowCopy(option: UnlockOption): RowCopy {
  const { t, i18n } = useTranslation();
  switch (option.type) {
    case 'episode':
      return {
        title: t('unlock.episodeOption'),
        subtitle: t('unlock.episodeOptionDetail'),
        price: t('coins.amount', { count: option.cost }),
      };
    case 'season':
      return {
        title: t('unlock.seasonOption'),
        subtitle: t('unlock.seasonOptionDetail', {
          from: option.fromEpisode,
          to: option.toEpisode,
        }),
        price: t('coins.amount', { count: option.cost }),
      };
    case 'membership':
      return {
        title: t('unlock.membershipOption'),
        subtitle: t('unlock.membershipOptionDetail'),
        price: t(`unlock.pricePer.${option.plan.period}`, {
          price: formatPrice(option.plan.price, i18n.language),
        }),
      };
    case 'ad':
      return {
        title: t('unlock.adOption'),
        subtitle: t('unlock.adOptionDetail'),
        price: t('unlock.adOptionPrice'),
      };
    default: {
      const _exhaustive: never = option;
      return _exhaustive;
    }
  }
}

export function UnlockOptionRow({ option, isSelected, onSelect }: UnlockOptionRowProps) {
  const { t } = useTranslation();
  const { title, subtitle, price } = useRowCopy(option);
  const isBestValue = option.type === 'season';

  return (
    <Card
      selected={isSelected}
      padding="sm"
      style={styles.card}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityLabel={[title, subtitle, price, isBestValue && t('badges.bestValue')]
        .filter(Boolean)
        .join(', ')}
    >
      <View style={styles.row}>
        <RadioIndicator selected={isSelected} />
        <View style={styles.titles}>
          <Text variant="bodyStrong">{title}</Text>
          <Text variant="bodySmall" color="secondary">
            {subtitle}
          </Text>
        </View>
        <Text variant="bodyStrong" color={isBestValue ? 'brand' : 'primary'}>
          {price}
        </Text>
      </View>
      {isBestValue && (
        <View style={styles.bestValue}>
          <Text variant="badge" color="onBrand">
            {t('badges.bestValue')}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  // Narrow sides so "Premium Membership" stays on one line next to its price.
  card: {
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  titles: {
    flex: 1,
  },
  // Sits on the card's top edge, with a ring of the card's color cutting it out.
  bestValue: {
    position: 'absolute',
    top: -spacing.xs,
    right: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: backgroundColors.surfaceRaised,
    backgroundColor: backgroundColors.brand,
  },
});
