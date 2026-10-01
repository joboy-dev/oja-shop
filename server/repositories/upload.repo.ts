import "server-only";
import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { uploads, orderItems, productImages, categories } = schema;
export type UploadRow = typeof uploads.$inferSelect;

export async function insertUpload(values: typeof uploads.$inferInsert): Promise<UploadRow> {
  const [row] = await db.insert(uploads).values(values).returning();
  return row;
}

export function getUploadsByIds(ids: string[], executor: DbExecutor = db): Promise<UploadRow[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return executor.select().from(uploads).where(inArray(uploads.id, ids));
}

export async function markAttached(ids: string[], sizes: Map<string, number>, executor: DbExecutor = db) {
  for (const id of ids) {
    await executor
      .update(uploads)
      .set({ status: "attached", attachedAt: new Date(), sizeBytes: sizes.get(id) ?? null })
      .where(eq(uploads.id, id));
  }
}

export function listStalePending(olderThan: Date): Promise<UploadRow[]> {
  return db.select().from(uploads).where(and(eq(uploads.status, "pending"), lt(uploads.createdAt, olderThan)));
}

export async function deleteUploadsByKeys(keys: string[]) {
  if (keys.length > 0) await db.delete(uploads).where(inArray(uploads.storageKey, keys));
}

/** True while anything still points at this object, so it must not be deleted from the bucket. */
export async function isKeyReferenced(key: string): Promise<boolean> {
  const [orders, images, cats] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(orderItems).where(eq(orderItems.imageStorageKey, key)),
    db.select({ n: sql<number>`count(*)::int` }).from(productImages).where(eq(productImages.storageKey, key)),
    db.select({ n: sql<number>`count(*)::int` }).from(categories).where(or(eq(categories.imageStorageKey, key))),
  ]);
  return orders[0].n + images[0].n + cats[0].n > 0;
}
