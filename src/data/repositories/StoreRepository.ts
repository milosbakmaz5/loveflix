import type { CoinPack, CoinPackId, MembershipPlan } from '@/domain';

export type CoinPurchaseReceipt = {
  packId: CoinPackId;
  /** Base coins plus bonus coins. */
  coinsGranted: number;
};

export type StoreRepository = {
  getCoinPacks(): Promise<readonly CoinPack[]>;
  getMembershipPlans(): Promise<readonly MembershipPlan[]>;
  /** Stands in for the App Store payment. Throws `RepositoryError('notFound')` for an unknown pack. */
  purchaseCoinPack(packId: CoinPackId): Promise<CoinPurchaseReceipt>;
};
