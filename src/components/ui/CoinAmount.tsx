import { Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { spacing, type TextColor, type TypographyVariant } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

type CoinAmountProps = {
  amount: number;
  variant?: TypographyVariant;
  color?: TextColor;
  showIcon?: boolean;
};

/** "⚡ 15 Coins". Coins are whole numbers, so no locale formatting beyond pluralisation. */
export function CoinAmount({
  amount,
  variant = 'bodyStrong',
  color = 'primary',
  showIcon = true,
}: CoinAmountProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {showIcon && <Icon icon={Zap} size="sm" color="brand" />}
      <Text variant={variant} color={color}>
        {t('coins.amount', { count: amount })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});
