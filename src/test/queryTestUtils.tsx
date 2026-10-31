import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { createMockRepositories, type Repositories, RepositoryProvider } from '@/data';

/** A QueryClient for one test: no retries, nothing garbage-collected mid-test. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
}

type TestWrapperOptions = {
  repositories?: Repositories;
  queryClient?: QueryClient;
};

/** Providers for `renderHook` / `render`: instant mock repositories unless others are passed. */
export function createTestWrapper({
  repositories = createMockRepositories({ latencyMs: 0 }),
  queryClient = createTestQueryClient(),
}: TestWrapperOptions = {}) {
  function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <RepositoryProvider repositories={repositories}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </RepositoryProvider>
    );
  }
  return TestWrapper;
}
