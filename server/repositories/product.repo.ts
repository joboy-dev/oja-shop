import "server-only";
import { and, asc, desc, eq, gt, gte, ilike, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import type { ProductFilters } from "@/lib/types/catalog";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { products, categories } = schema;

const withRelations = { category: true, images: true } as const;

type ProductWithRelations = Awaited<ReturnType<typeof findOne>>;
export type ProductRow = NonNullable<ProductWithRelations>;

function findOne(slug: string, executor: DbExecutor = db) {
  return executor.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: withRelations,
  });
}

function whereFor(filters: Pick<ProductFilters, "category" | "q" | "minPrice" | "maxPrice" | "inStock">): SQL | undefined {
  const conds: (SQL | undefined)[] = [eq(products.isActive, true)];
  if (filters.category) {
    conds.push(
      inArray(
        products.categoryId,
        db.select({ id: categories.id }).from(categories).where(eq(categories.slug, filters.category)),
      ),
    );
  }
  if (filters.q) {
    const like = `%${filters.q.replace(/[%_\\]/g, "\\$&")}%`;
    conds.push(or(ilike(products.name, like), ilike(products.shortDescription, like)));
  }
  if (filters.minPrice != null) conds.push(gte(products.price, filters.minPrice));
  if (filters.maxPrice != null) conds.push(lte(products.price, filters.maxPrice));
  if (filters.inStock) conds.push(gt(products.stock, 0));
  return and(...conds);
}

const orderFor = (sort: ProductFilters["sort"]) => {
  switch (sort) {
    case "price-asc":
      return [asc(products.price), asc(products.name)];
    case "price-desc":
      return [desc(products.price), asc(products.name)];
    case "name":
      return [asc(products.name)];
    default:
      return [desc(products.createdAt), asc(products.name)];
  }
};

export async function listProducts(filters: ProductFilters): Promise<{ rows: ProductRow[]; total: number }> {
  const where = whereFor(filters);
  const [rows, [{ total }]] = await Promise.all([
    db.query.products.findMany({
      where,
      orderBy: orderFor(filters.sort),
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      with: withRelations,
    }),
    db.select({ total: sql<number>`count(*)::int` }).from(products).where(where),
  ]);
  return { rows, total };
}

export const getProductBySlug = (slug: string) => findOne(slug);

export async function getProductsByIds(ids: string[], executor: DbExecutor = db): Promise<ProductRow[]> {
  if (ids.length === 0) return [];
  return executor.query.products.findMany({ where: inArray(products.id, ids), with: withRelations });
}

export function listFeatured(limit: number) {
  return db.query.products.findMany({
    where: and(eq(products.isActive, true), eq(products.isFeatured, true), gt(products.stock, 0)),
    orderBy: [desc(products.createdAt)],
    limit,
    with: withRelations,
  });
}

export function listNewest(limit: number) {
  return db.query.products.findMany({
    where: eq(products.isActive, true),
    orderBy: [desc(products.createdAt)],
    limit,
    with: withRelations,
  });
}

export function listRelated(categorySlug: string, excludeId: string, limit: number) {
  return db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      ne(products.id, excludeId),
      inArray(
        products.categoryId,
        db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)),
      ),
    ),
    orderBy: [desc(products.isFeatured), desc(products.createdAt)],
    limit,
    with: withRelations,
  });
}

export function listActiveSlugs() {
  return db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.isActive, true));
}

/**
 * Atomically take `quantity` units. Returns false (and changes nothing) if stock is lower,
 * which is what makes overselling impossible even under concurrent orders.
 */
export async function decrementStock(productId: string, quantity: number, executor: DbExecutor = db): Promise<boolean> {
  const rows = await executor
    .update(products)
    .set({ stock: sql`${products.stock} - ${quantity}` })
    .where(and(eq(products.id, productId), gte(products.stock, quantity)))
    .returning({ id: products.id });
  return rows.length > 0;
}

/** Put stock back (order cancelled). */
export async function incrementStock(productId: string, quantity: number, executor: DbExecutor = db) {
  await executor
    .update(products)
    .set({ stock: sql`${products.stock} + ${quantity}` })
    .where(eq(products.id, productId));
}
