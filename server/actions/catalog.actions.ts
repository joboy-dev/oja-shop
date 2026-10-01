"use server";

import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import { searchQuerySchema } from "@/lib/validators/search";
import { searchProducts } from "@/server/services/catalog.service";

export interface SearchHit {
  slug: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string | null;
}

/** Public, uncached lookup for the ⌘K search palette. */
export async function searchProductsAction(query: string): Promise<ActionResult<SearchHit[]>> {
  const parsed = searchQuerySchema.safeParse(query);
  if (!parsed.success) return ok([]);
  try {
    const products = await searchProducts(parsed.data);
    return ok(
      products.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        category: p.category.name,
        imageUrl: p.image?.url ?? null,
      })),
    );
  } catch (err) {
    console.error("[search]", err);
    return fail("Search isn't available right now.");
  }
}
