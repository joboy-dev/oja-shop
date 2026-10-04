import "server-only";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { env } from "@/server/config/env";
import { db, schema } from "@/server/db/client";
import { notifyWelcome } from "@/server/services/notification.service";

/**
 * Origins the mobile app may be sent back to after Google sign-in. The expo plugin appends the
 * session to that deep link, so never trust a scheme you don't own: `oja://` is ours; Expo Go's
 * `exp://` is only trusted in development or when MOBILE_TRUSTED_ORIGINS lists it explicitly.
 */
const mobileOrigins = [
  "oja://",
  ...(process.env.NODE_ENV === "development" ? ["exp://", "exp://**"] : []),
  ...(process.env.MOBILE_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];

export const isAdminEmail = (email: string) => env.ADMIN_EMAILS.includes(email.trim().toLowerCase());

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: mobileOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: false },
      phone: { type: "string", required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  databaseHooks: {
    user: {
      create: {
        // Emails listed in ADMIN_EMAILS become admins the first time they sign in.
        before: async (user) => ({
          data: { ...user, role: isAdminEmail(user.email) ? "admin" : "customer" },
        }),
        after: async (user) => {
          const send = () => notifyWelcome(user.email, user.name).catch((e) => console.error("[welcome email]", e));
          try {
            after(send);
          } catch {
            void send(); // outside a request scope (e.g. scripts), just fire it
          }
        },
      },
    },
  },
  // nextCookies() must stay last.
  plugins: [expo(), nextCookies()],
});
