import type { CoinPack, CoinPackId, MembershipPlan, Money, SeriesId } from '@/domain';

export type CoinPurchaseReceipt = {
  packId: CoinPackId;
  /** Base coins plus bonus coins. */
  coinsGranted: number;
};

export type SeasonPurchaseReceipt = {
  seriesId: SeriesId;
};

export type StoreRepository = {
  getCoinPacks(): Promise<readonly CoinPack[]>;
  getMembershipPlans(): Promise<readonly MembershipPlan[]>;
  /** Stands in for the App Store payment. Throws `RepositoryError('notFound')` for an unknown pack. */
  purchaseCoinPack(packId: CoinPackId): Promise<CoinPurchaseReceipt>;
  /** Money price of the "Unlock Full Season" bundle on Series detail. */
  getSeasonBundlePrice(): Promise<Money>;
  /** Stands in for the App Store payment of the bundle. */
  purchaseSeason(seriesId: SeriesId): Promise<SeasonPurchaseReceipt>;
};
