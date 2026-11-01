import { Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { Icon } from './Icon';
import { Text } from './Text';

type CoinAmountProps = {
  amount: number;
};

/** "⚡ 15 Coins". Coins are whole numbers, so no locale formatting beyond pluralisation. */
export function CoinAmount({ amount }: CoinAmountProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <Icon icon={Zap} size="sm" color="brand" />
      <Text variant="bodyStrong">{t('coins.amount', { count: amount })}</Text>
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
