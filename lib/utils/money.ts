import { shopConfig } from "@/lib/config/shop";

/** Format integer kobo as currency. Whole-naira amounts drop the decimals: ₦12,500 / ₦12,500.50 */
export function formatMoney(kobo: number, currency: string = shopConfig.currency): string {
  const whole = kobo % 100 === 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(kobo / 100);
}

/** Convert a user-typed naira amount (e.g. "12,500.50") to integer kobo. Returns null if invalid. */
export function nairaToKobo(input: string | number): number | null {
  const n = typeof input === "number" ? input : Number(input.replace(/[₦,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
