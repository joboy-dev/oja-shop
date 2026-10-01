import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate: bounces visitors with no session cookie to /login.
 * It only checks that a cookie exists, so it is NOT the security boundary —
 * requireUser()/requireAdmin() in layouts and authorize() in actions are.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/checkout/:path*", "/account/:path*", "/admin/:path*"] };
