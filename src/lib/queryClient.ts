import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Mock data never changes during a session.
        staleTime: Infinity,
        retry: 1,
      },
    },
  });
}
