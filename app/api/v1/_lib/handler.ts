import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { fail, ok } from "@/lib/types/action-result";
import { getSessionUser, type SessionUser } from "@/server/auth/session";
import { ServiceError } from "@/server/services/errors";

/**
 * Shared plumbing for the JSON API the mobile app uses. Handlers stay thin: guard → parse → one
 * service call → return data. Every response is the same `ActionResult` envelope the Server Actions
 * return, so clients handle one shape.
 */

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** public: no session lookup · optional: user or null · user: 401 when signed out. */
type Access = "public" | "optional" | "user";

type UserFor<A extends Access> = A extends "user" ? SessionUser : A extends "optional" ? SessionUser | null : null;

interface RouteContext<P, A extends Access> {
  req: NextRequest;
  params: P;
  user: UserFor<A>;
}

interface RouteOptions<A extends Access> {
  access?: A;
  /** "public" lets the CDN cache a successful GET briefly; the default never caches. */
  cache?: "public" | "private";
}

const CACHE_CONTROL = {
  public: "public, s-maxage=30, stale-while-revalidate=120",
  private: "private, no-store",
} as const;

const respond = (body: unknown, status: number, cache: "public" | "private") =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": status < 300 ? CACHE_CONTROL[cache] : CACHE_CONTROL.private },
  });

export function route<P extends Record<string, string> = Record<string, string>, A extends Access = "public">(
  options: RouteOptions<A>,
  handler: (ctx: RouteContext<P, A>) => Promise<unknown>,
) {
  const access = options.access ?? "public";
  const cache = options.cache ?? "private";

  return async (req: NextRequest, ctx: { params: Promise<P> }): Promise<NextResponse> => {
    try {
      const user = access === "public" ? null : await getSessionUser();
      if (access === "user" && !user) throw new HttpError(401, "Sign in to continue.");
      const data = await handler({ req, params: await ctx.params, user: user as UserFor<A> });
      return respond(ok(data), 200, cache);
    } catch (err) {
      if (err instanceof HttpError) return respond(fail(err.message, err.fieldErrors), err.status, cache);
      if (err instanceof ServiceError) return respond(fail(err.message, err.fieldErrors), 409, cache);
      console.error("[api/v1]", req.method, req.nextUrl.pathname, err);
      return respond(fail("Something went wrong. Please try again."), 500, cache);
    }
  };
}

/** Parse a JSON body with a zod schema; failures become a 400 with per-field messages. */
export async function readJson<S extends z.ZodType>(
  req: Request,
  schema: S,
  message = "Please check your details.",
): Promise<z.output<S>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, "Send a JSON body.");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new HttpError(400, message, parsed.error.flatten().fieldErrors as Record<string, string[]>);
  return parsed.data;
}

/** Validate a single path or query value (e.g. a uuid). */
export function readValue<S extends z.ZodType>(schema: S, value: unknown, message = "That request isn't valid."): z.output<S> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new HttpError(400, message);
  return parsed.data;
}
