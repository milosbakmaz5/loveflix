import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { type NativeScrollEvent, type NativeSyntheticEvent, StyleSheet, View } from 'react-native';

import { Text, useHeaderHeight, useListBottomPadding } from '@/components/ui';
import type { CoinPack, CoinUnlockOption, Episode, MembershipPlan, Series } from '@/domain';
import { borderColors, layout, spacing } from '@/theme';

import { useCoinStore } from '../hooks/useCoinStore';
import { BalanceCard } from './BalanceCard';
import { CoinPackCard } from './CoinPackCard';
import { LockedEpisodeSummary } from './LockedEpisodeSummary';
import { OrDivider } from './OrDivider';
import { PurchaseFooter } from './PurchaseFooter';
import { VipMembershipCard } from './VipMembershipCard';

type CoinStoreProps = {
  series: Series;
  episode: Episode;
  seasonEpisodes: readonly Episode[];
  packs: readonly CoinPack[];
  plans: readonly MembershipPlan[];
  optionType: CoinUnlockOption['type'];
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const COLUMNS = 2;

function getPackKey(pack: CoinPack) {
  return pack.id;
}

export function CoinStore({
  series,
  episode,
  seasonEpisodes,
  packs,
  plans,
  optionType,
  onScroll,
}: CoinStoreProps) {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  // The purchase footer covers the home indicator, the way a tab bar does.
  const bottomPadding = useListBottomPadding({ hasTabBar: true });
  const store = useCoinStore({ episode, seasonEpisodes, packs, plans, optionType });
  const { selected, vipPlan } = store;
  const selectedKey = selected?.type === 'pack' ? selected.pack.id : selected?.type;

  return (
    <View style={styles.store}>
      <FlashList
        data={packs}
        extraData={selectedKey}
        numColumns={COLUMNS}
        keyExtractor={getPackKey}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + spacing.xs,
          paddingBottom: bottomPadding,
          paddingHorizontal: layout.screenGutter,
        }}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <LockedEpisodeSummary series={series} episode={episode} unlockCost={store.unlockCost} />
            <BalanceCard balance={store.balance} />
            <View style={styles.separator} />
            <Text variant="h2" accessibilityRole="header">
              {t('store.recharge')}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={index % COLUMNS === 0 ? styles.leftCell : styles.rightCell}>
            <CoinPackCard
              pack={item}
              isSelected={selected?.type === 'pack' && selected.pack.id === item.id}
              onSelect={() => store.select({ type: 'pack', pack: item })}
            />
          </View>
        )}
        ListFooterComponent={
          vipPlan && (
            <View style={styles.listFooter}>
              <OrDivider />
              <VipMembershipCard
                plan={vipPlan}
                isSelected={selected?.type === 'membership'}
                onSelect={() => store.select({ type: 'membership', plan: vipPlan })}
              />
            </View>
          )
        }
      />
      {selected && (
        <PurchaseFooter
          item={selected}
          isBuying={store.isBuying}
          hasPaymentFailed={store.hasPaymentFailed}
          onBuy={store.buy}
        />
      )}
    </View>
  );
}

const CELL_GAP = spacing.sm;

const styles = StyleSheet.create({
  store: {
    flex: 1,
  },
  listHeader: {
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  separator: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: borderColors.default,
  },
  leftCell: {
    paddingRight: CELL_GAP / 2,
    paddingBottom: CELL_GAP,
  },
  rightCell: {
    paddingLeft: CELL_GAP / 2,
    paddingBottom: CELL_GAP,
  },
  listFooter: {
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
});
