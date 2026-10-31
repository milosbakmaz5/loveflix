import { createContext, type ReactNode, use } from 'react';

import type { Repositories } from './repositories';

const RepositoryContext = createContext<Repositories | null>(null);

type RepositoryProviderProps = {
  repositories: Repositories;
  children: ReactNode;
};

/** The single place where the app's data sources are chosen (mock today, API later). */
export function RepositoryProvider({ repositories, children }: RepositoryProviderProps) {
  return <RepositoryContext value={repositories}>{children}</RepositoryContext>;
}

export function useRepositories(): Repositories {
  const repositories = use(RepositoryContext);
  if (repositories === null) {
    throw new Error('useRepositories must be used inside <RepositoryProvider>');
  }
  return repositories;
}
