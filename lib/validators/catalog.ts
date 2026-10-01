import { z } from "zod";
import { shopConfig, sortOptionIds } from "@/lib/config/shop";
import type { ProductFilters } from "@/lib/types/catalog";
import { nairaToKobo } from "@/lib/utils/money";

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

const naira = z.preprocess((v) => {
  const s = first(v);
  if (s === undefined || s === "") return undefined;
  return nairaToKobo(String(s)) ?? undefined;
}, z.number().int().min(0).max(1_000_000_000).optional());

/** Parses Next.js searchParams for /shop into safe filters; unknown or invalid values are ignored. */
export const shopSearchSchema = z.object({
  q: z.preprocess((v) => (first(v) ? String(first(v)).trim().slice(0, 80) : undefined), z.string().optional()),
  sort: z.preprocess(first, z.enum(sortOptionIds).catch("newest")).default("newest"),
  min: naira,
  max: naira,
  stock: z.preprocess((v) => first(v) === "1", z.boolean()).default(false),
  page: z.preprocess((v) => Number.parseInt(String(first(v) ?? "1"), 10), z.number().int().min(1).max(500).catch(1)),
});

export function parseShopFilters(
  params: Record<string, string | string[] | undefined>,
  category?: string,
): ProductFilters {
  const p = shopSearchSchema.parse(params);
  return {
    category,
    q: p.q || undefined,
    minPrice: p.min,
    maxPrice: p.max,
    inStock: p.stock || undefined,
    sort: p.sort,
    page: p.page,
    pageSize: shopConfig.pageSize,
  };
}
