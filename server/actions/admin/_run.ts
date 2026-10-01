import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import { authorize, type SessionUser } from "@/server/auth/session";
import { ServiceError } from "@/server/services/errors";

/** Shared wrapper: admin check, then run, mapping expected errors to `{ ok: false }`. */
export async function runAdmin<T>(label: string, fn: (admin: SessionUser) => Promise<T>): Promise<ActionResult<T>> {
  const session = await authorize({ admin: true });
  if (!session.ok) return fail(session.error);
  try {
    return ok(await fn(session.user));
  } catch (err) {
    if (err instanceof ServiceError) return fail(err.message, err.fieldErrors);
    console.error(`[admin:${label}]`, err);
    return fail("Something went wrong. Please try again.");
  }
}
