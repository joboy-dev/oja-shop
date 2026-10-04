import { parseShopFilters } from "@/lib/validators/catalog";
import { listProducts } from "@/server/services/catalog.service";
import { route } from "../_lib/handler";

/**
 * Query: category, q, sort, min, max (naira), stock=1, page — the same names the /shop page uses,
 * parsed by the same function, so unknown or invalid values are ignored the same way.
 */
export const GET = route({ cache: "public" }, async ({ req }) => {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const category = params.category?.trim().slice(0, 80) || undefined;
  return listProducts(parseShopFilters(params, category));
});
