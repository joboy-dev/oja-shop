import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/server/db/client";

const { wishlistItems } = schema;

export async function listWishlistProductIds(userId: string): Promise<string[]> {
  const rows = await db.select({ id: wishlistItems.productId }).from(wishlistItems).where(eq(wishlistItems.userId, userId));
  return rows.map((r) => r.id);
}

export function listWishlist(userId: string) {
  return db.query.wishlistItems.findMany({
    where: eq(wishlistItems.userId, userId),
    orderBy: [desc(wishlistItems.createdAt)],
    with: { product: { with: { images: true, category: true } } },
  });
}

export async function addWishlistItem(userId: string, productId: string) {
  await db.insert(wishlistItems).values({ userId, productId }).onConflictDoNothing();
}

export async function removeWishlistItem(userId: string, productId: string) {
  await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
}

export async function isWished(userId: string, productId: string): Promise<boolean> {
  const rows = await db
    .select({ id: wishlistItems.productId })
    .from(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
    .limit(1);
  return rows.length > 0;
}
