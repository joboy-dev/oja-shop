import "server-only";
import { unstable_cache } from "next/cache";
import { shopConfig } from "@/lib/config/shop";
import type { CategoryDTO, Paginated, ProductDetail, ProductFilters, ProductSummary } from "@/lib/types/catalog";
import * as categoryRepo from "@/server/repositories/category.repo";
import * as productRepo from "@/server/repositories/product.repo";
import { toCategoryDTO, toProductDetail, toProductSummary } from "./mappers";

/** Catalogue reads are cached for 5 minutes and invalidated by tag when admins or orders change data. */
const REVALIDATE = 300;

export const getCategories = unstable_cache(
  async (): Promise<CategoryDTO[]> => (await categoryRepo.listCategories()).map(toCategoryDTO),
  ["categories"],
  { tags: ["categories", "products"], revalidate: REVALIDATE },
);

export async function getCategory(slug: string): Promise<CategoryDTO | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function listProducts(filters: ProductFilters): Promise<Paginated<ProductSummary>> {
  const run = unstable_cache(
    async () => {
      const { rows, total } = await productRepo.listProducts(filters);
      return {
        items: rows.map(toProductSummary),
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
      };
    },
    ["products:list", JSON.stringify(filters)],
    { tags: ["products"], revalidate: REVALIDATE },
  );
  return run();
}

export function getProduct(slug: string): Promise<ProductDetail | null> {
  return unstable_cache(
    async () => {
      const row = await productRepo.getProductBySlug(slug);
      return row ? toProductDetail(row) : null;
    },
    ["product", slug],
    { tags: ["products", `product:${slug}`], revalidate: REVALIDATE },
  )();
}

export const getFeaturedProducts = unstable_cache(
  async (): Promise<ProductSummary[]> => (await productRepo.listFeatured(8)).map(toProductSummary),
  ["products:featured"],
  { tags: ["products"], revalidate: REVALIDATE },
);

export const getNewArrivals = unstable_cache(
  async (): Promise<ProductSummary[]> => (await productRepo.listNewest(8)).map(toProductSummary),
  ["products:new"],
  { tags: ["products"], revalidate: REVALIDATE },
);

export function getRelatedProducts(categorySlug: string, excludeId: string): Promise<ProductSummary[]> {
  return unstable_cache(
    async () => (await productRepo.listRelated(categorySlug, excludeId, 4)).map(toProductSummary),
    ["products:related", categorySlug, excludeId],
    { tags: ["products"], revalidate: REVALIDATE },
  )();
}

/** Live (uncached) search for the ⌘K palette. */
export async function searchProducts(q: string, limit = 6): Promise<ProductSummary[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  const { rows } = await productRepo.listProducts({
    q: term,
    sort: "newest",
    page: 1,
    pageSize: limit,
  });
  return rows.map(toProductSummary);
}

export async function getSitemapProducts() {
  return productRepo.listActiveSlugs();
}

export const defaultPageSize = shopConfig.pageSize;
