import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, CoinAmount, Text } from '@/components/ui';

type BalanceCardProps = {
  balance: number;
};

export function BalanceCard({ balance }: BalanceCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <View style={styles.row}>
        <Text variant="bodySmall" color="secondary">
          {t('store.balance')}
        </Text>
        <CoinAmount amount={balance} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
