import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/utils/safe-redirect";
import { auth, isAdminEmail } from "./auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  role: "customer" | "admin";
}

/** Current user from the session cookie, or null. Deduplicated per request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const u = session.user as typeof session.user & { role?: string; phone?: string | null };
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image ?? null,
    phone: u.phone ?? null,
    // ADMIN_EMAILS is authoritative; the DB role also lets an admin be granted by hand.
    role: u.role === "admin" || isAdminEmail(u.email) ? "admin" : "customer",
  };
});

/** For pages and layouts: send signed-out visitors to /login and return them afterwards. */
export async function requireUser(returnTo = "/"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(safeNext(returnTo))}`);
  return user;
}

/** For admin pages and layouts: signed-out → /login, signed-in non-admin → 404-style redirect home. */
export async function requireAdmin(returnTo = "/admin"): Promise<SessionUser> {
  const user = await requireUser(returnTo);
  if (user.role !== "admin") redirect("/");
  return user;
}

export type AuthorizeResult = { ok: true; user: SessionUser } | { ok: false; error: string };

/**
 * For Server Actions: never redirects, so the client can show a message.
 * This (not proxy.ts) is the security boundary for mutations.
 */
export async function authorize(options: { admin?: boolean } = {}): Promise<AuthorizeResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sign in to continue." };
  if (options.admin && user.role !== "admin") return { ok: false, error: "You don't have access to that." };
  return { ok: true, user };
}
