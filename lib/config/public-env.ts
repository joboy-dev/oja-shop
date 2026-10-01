/** Variables safe to ship to the browser. */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "NGN",
} as const;
