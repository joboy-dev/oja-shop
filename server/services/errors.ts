import "server-only";

/** An expected, user-facing failure. Actions turn these into `{ ok: false, error }`. */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
