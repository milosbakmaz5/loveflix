import type { CatalogRepository } from './CatalogRepository';
import { createMockCatalogRepository } from './MockCatalogRepository';
import { createMockStoreRepository } from './MockStoreRepository';
import type { MockRepositoryOptions } from './simulate';
import type { StoreRepository } from './StoreRepository';

export type { CatalogRepository, HomeFeedData } from './CatalogRepository';
export { isRepositoryError, RepositoryError } from './errors';
export { createMockCatalogRepository } from './MockCatalogRepository';
export { createMockStoreRepository } from './MockStoreRepository';
export type {
  CoinPurchaseReceipt,
  SeasonPurchaseReceipt,
  StoreRepository,
} from './StoreRepository';

export type Repositories = {
  catalog: CatalogRepository;
  store: StoreRepository;
};

/** The app's data sources. A real API would add `createApiRepositories()` next to this. */
export function createMockRepositories(options?: MockRepositoryOptions): Repositories {
  return {
    catalog: createMockCatalogRepository(options),
    store: createMockStoreRepository(options),
  };
}
