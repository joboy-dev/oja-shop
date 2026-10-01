import "server-only";
import { and, asc, count, eq } from "drizzle-orm";
import { db, schema } from "@/server/db/client";

const { categories, products } = schema;

export type CategoryRow = typeof categories.$inferSelect & { productCount: number };

export async function listCategories(): Promise<CategoryRow[]> {
  const rows = await db
    .select({ category: categories, productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
  return rows.map((r) => ({ ...r.category, productCount: r.productCount }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const all = await listCategories();
  return all.find((c) => c.slug === slug) ?? null;
}
