type RepositoryErrorKind = 'network' | 'notFound';

/** The only error type repositories throw, so screens can tell "retry" from "not found". */
export class RepositoryError extends Error {
  override readonly name = 'RepositoryError';
  readonly kind: RepositoryErrorKind;

  constructor(kind: RepositoryErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export function isRepositoryError(error: unknown): error is RepositoryError {
  return error instanceof RepositoryError;
}
