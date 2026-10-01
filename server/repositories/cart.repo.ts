import "server-only";
import { and, eq } from "drizzle-orm";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { carts, cartItems } = schema;

export async function getOrCreateCartId(userId: string, executor: DbExecutor = db): Promise<string> {
  await executor.insert(carts).values({ userId }).onConflictDoNothing({ target: carts.userId });
  const [cart] = await executor.select({ id: carts.id }).from(carts).where(eq(carts.userId, userId));
  return cart.id;
}

export function listCartItems(cartId: string, executor: DbExecutor = db) {
  return executor.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    orderBy: (t, { asc }) => [asc(t.addedAt)],
    with: { product: { with: { images: true, category: true } } },
  });
}

export type CartItemRow = Awaited<ReturnType<typeof listCartItems>>[number];

/** Set an exact quantity (inserts or updates). */
export async function setItemQuantity(cartId: string, productId: string, quantity: number, executor: DbExecutor = db) {
  await executor
    .insert(cartItems)
    .values({ cartId, productId, quantity })
    .onConflictDoUpdate({ target: [cartItems.cartId, cartItems.productId], set: { quantity } });
  await touch(cartId, executor);
}

export async function removeItem(cartId: string, productId: string, executor: DbExecutor = db) {
  await executor.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));
  await touch(cartId, executor);
}

export async function clearCart(cartId: string, executor: DbExecutor = db) {
  await executor.delete(cartItems).where(eq(cartItems.cartId, cartId));
  await touch(cartId, executor);
}

async function touch(cartId: string, executor: DbExecutor) {
  await executor.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId));
}
