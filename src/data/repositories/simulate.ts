import { DEMO_CONFIG } from '@/config/demo';

import type { CatalogRepository } from './CatalogRepository';
import { RepositoryError } from './errors';
import type { StoreRepository } from './StoreRepository';

export type RepositoryOperation = keyof CatalogRepository | keyof StoreRepository;

export type MockRepositoryOptions = {
  /** Simulated network latency. Defaults to `DEMO_CONFIG.mockLatencyMs`. */
  latencyMs?: number;
  /** Return true to make that call fail with a network error. */
  shouldFail?: (operation: RepositoryOperation) => boolean;
};

type Simulate = <T>(operation: RepositoryOperation, produce: () => T) => Promise<T>;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Callers get their own copy, so nothing can change the fixtures by accident.
// The fixtures are plain JSON-safe data (numbers, strings, arrays, objects).
function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Wraps a fixture lookup in latency, optional failure and a defensive copy. */
export function createSimulate({
  latencyMs = DEMO_CONFIG.mockLatencyMs,
  shouldFail = () => false,
}: MockRepositoryOptions = {}): Simulate {
  return async (operation, produce) => {
    if (latencyMs > 0) {
      await wait(latencyMs);
    }
    if (shouldFail(operation)) {
      throw new RepositoryError('network', `Simulated network error in ${operation}`);
    }
    return copy(produce());
  };
}
