import "server-only";
import { and, asc, count, desc, eq, ilike, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { shopConfig } from "@/lib/config/shop";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { products, categories, productImages } = schema;

export interface AdminProductFilters {
  q?: string;
  category?: string;
  status?: "active" | "hidden" | "low" | "out";
  page: number;
  pageSize: number;
}

function where(f: AdminProductFilters): SQL | undefined {
  const c: (SQL | undefined)[] = [];
  if (f.q) {
    const like = `%${f.q.replace(/[%_\\]/g, "\\$&")}%`;
    c.push(or(ilike(products.name, like), ilike(products.slug, like)));
  }
  if (f.category) c.push(eq(products.categoryId, f.category));
  if (f.status === "active") c.push(eq(products.isActive, true));
  if (f.status === "hidden") c.push(eq(products.isActive, false));
  if (f.status === "out") c.push(eq(products.stock, 0));
  if (f.status === "low") c.push(and(sql`${products.stock} > 0`, lte(products.stock, shopConfig.lowStockThreshold)));
  return and(...c);
}

export async function listAdminProducts(f: AdminProductFilters) {
  const w = where(f);
  const [rows, [{ total }]] = await Promise.all([
    db.query.products.findMany({
      where: w,
      orderBy: [desc(products.updatedAt)],
      limit: f.pageSize,
      offset: (f.page - 1) * f.pageSize,
      with: { category: true, images: true },
    }),
    db.select({ total: count() }).from(products).where(w),
  ]);
  return { rows, total };
}
export type AdminProductRow = Awaited<ReturnType<typeof listAdminProducts>>["rows"][number];

export function getAdminProduct(id: string) {
  return db.query.products.findFirst({ where: eq(products.id, id), with: { category: true, images: true } });
}

export async function productSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.slug, slug), excludeId ? ne(products.id, excludeId) : undefined))
    .limit(1);
  return rows.length > 0;
}

export type ProductValues = Omit<typeof products.$inferInsert, "id" | "createdAt" | "updatedAt">;

export async function insertProduct(values: ProductValues, executor: DbExecutor = db) {
  const [row] = await executor.insert(products).values(values).returning({ id: products.id, slug: products.slug });
  return row;
}

export async function updateProduct(id: string, values: ProductValues, executor: DbExecutor = db) {
  const [row] = await executor.update(products).set(values).where(eq(products.id, id)).returning({ id: products.id, slug: products.slug });
  return row ?? null;
}

export async function setProductActive(id: string, isActive: boolean) {
  const [row] = await db.update(products).set({ isActive }).where(eq(products.id, id)).returning({ slug: products.slug });
  return row ?? null;
}

export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
}

export interface ImageSyncItem {
  imageId?: string;
  storageKey?: string;
  alt: string;
  position: number;
}

/**
 * Make the product's images match `items` exactly: update kept ones, insert new uploads, delete the rest.
 * Returns the bucket keys of deleted images so the caller can clean the bucket.
 */
export async function syncProductImages(productId: string, items: ImageSyncItem[], executor: DbExecutor = db): Promise<string[]> {
  const existing = await executor.select().from(productImages).where(eq(productImages.productId, productId));
  const existingById = new Map(existing.map((i) => [i.id, i]));
  const keep = new Set<string>();

  for (const item of items) {
    if (item.imageId) {
      if (!existingById.has(item.imageId)) continue; // not this product's image: ignore
      keep.add(item.imageId);
      await executor.update(productImages).set({ alt: item.alt, position: item.position }).where(eq(productImages.id, item.imageId));
    } else if (item.storageKey) {
      await executor.insert(productImages).values({ productId, storageKey: item.storageKey, alt: item.alt, position: item.position });
    }
  }

  const removed = existing.filter((i) => !keep.has(i.id));
  for (const r of removed) await executor.delete(productImages).where(eq(productImages.id, r.id));
  return removed.flatMap((r) => (r.storageKey ? [r.storageKey] : []));
}

export async function productImageKeys(productId: string): Promise<string[]> {
  const rows = await db.select({ key: productImages.storageKey }).from(productImages).where(eq(productImages.productId, productId));
  return rows.flatMap((r) => (r.key ? [r.key] : []));
}

// ── categories ─────────────────────────────────────────────────────
export type CategoryValues = Omit<typeof categories.$inferInsert, "id" | "createdAt" | "updatedAt">;

export const categorySlugTaken = async (slug: string, excludeId?: string) =>
  (await db.select({ id: categories.id }).from(categories).where(and(eq(categories.slug, slug), excludeId ? ne(categories.id, excludeId) : undefined)).limit(1)).length > 0;

export async function insertCategory(values: CategoryValues) {
  const [row] = await db.insert(categories).values(values).returning();
  return row;
}
export async function updateCategory(id: string, values: Partial<CategoryValues>) {
  const [row] = await db.update(categories).set(values).where(eq(categories.id, id)).returning();
  return row ?? null;
}
export const getCategoryById = async (id: string) => (await db.select().from(categories).where(eq(categories.id, id)))[0] ?? null;
export async function countProductsIn(categoryId: string) {
  const [{ n }] = await db.select({ n: count() }).from(products).where(eq(products.categoryId, categoryId));
  return n;
}
export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
}
export const listCategoryOptions = () => db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
