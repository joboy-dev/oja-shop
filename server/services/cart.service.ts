import "server-only";
import { maxPurchasable, mergeCartItems } from "@/lib/cart/merge";
import type { CartItemInput, CartLine } from "@/lib/types/cart";
import * as cartRepo from "@/server/repositories/cart.repo";
import type { ProductRow } from "@/server/repositories/product.repo";
import * as productRepo from "@/server/repositories/product.repo";
import { ServiceError } from "./errors";
import { toProductSummary } from "./mappers";

function toLine(product: ProductRow, quantity: number): CartLine {
  const summary = toProductSummary(product);
  const available = product.isActive && product.stock > 0;
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: summary.image?.url ?? null,
    imageAlt: summary.image?.alt ?? product.name,
    unitPrice: product.price,
    quantity: available ? Math.min(quantity, maxPurchasable(product.stock)) : quantity,
    stock: product.stock,
    available,
  };
}

/** The signed-in user's saved cart, with current prices and stock. */
export async function getCart(userId: string): Promise<CartLine[]> {
  const cartId = await cartRepo.getOrCreateCartId(userId);
  const items = await cartRepo.listCartItems(cartId);
  return items.filter((i) => i.product).map((i) => toLine(i.product, i.quantity));
}

async function requireBuyable(productId: string): Promise<ProductRow> {
  const [product] = await productRepo.getProductsByIds([productId]);
  if (!product || !product.isActive) throw new ServiceError("That product is no longer available.");
  if (product.stock <= 0) throw new ServiceError(`${product.name} is sold out.`);
  return product;
}

/** Add `quantity` to the line, never beyond stock. */
export async function addItem(userId: string, { productId, quantity }: CartItemInput): Promise<CartLine[]> {
  const product = await requireBuyable(productId);
  const cartId = await cartRepo.getOrCreateCartId(userId);
  const existing = (await cartRepo.listCartItems(cartId)).find((i) => i.productId === productId);
  const next = Math.min((existing?.quantity ?? 0) + quantity, maxPurchasable(product.stock));
  await cartRepo.setItemQuantity(cartId, productId, next);
  return getCart(userId);
}

/** Set an exact quantity; 0 removes the line. Clamped to stock. */
export async function setQuantity(userId: string, productId: string, quantity: number): Promise<CartLine[]> {
  const cartId = await cartRepo.getOrCreateCartId(userId);
  if (quantity <= 0) {
    await cartRepo.removeItem(cartId, productId);
  } else {
    const product = await requireBuyable(productId);
    await cartRepo.setItemQuantity(cartId, productId, Math.min(quantity, maxPurchasable(product.stock)));
  }
  return getCart(userId);
}

export async function removeItem(userId: string, productId: string): Promise<CartLine[]> {
  const cartId = await cartRepo.getOrCreateCartId(userId);
  await cartRepo.removeItem(cartId, productId);
  return getCart(userId);
}

/**
 * On sign-in: fold the browser's guest cart into the saved cart.
 * Quantities add up, then clamp to stock; unavailable products are skipped.
 */
export async function mergeGuestCart(userId: string, guestItems: CartItemInput[]): Promise<CartLine[]> {
  if (guestItems.length === 0) return getCart(userId);

  const cartId = await cartRepo.getOrCreateCartId(userId);
  const saved = await cartRepo.listCartItems(cartId);
  const merged = mergeCartItems(
    saved.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    guestItems,
  );
  const products = new Map(
    (await productRepo.getProductsByIds(merged.map((m) => m.productId))).map((p) => [p.id, p]),
  );

  for (const { productId, quantity } of merged) {
    const product = products.get(productId);
    if (!product || !product.isActive || product.stock <= 0) continue;
    await cartRepo.setItemQuantity(cartId, productId, Math.min(quantity, maxPurchasable(product.stock)));
  }
  return getCart(userId);
}

/** Guest carts live in the browser; this refreshes their prices and stock. */
export async function resolveGuestCart(items: CartItemInput[]): Promise<CartLine[]> {
  const products = new Map((await productRepo.getProductsByIds(items.map((i) => i.productId))).map((p) => [p.id, p]));
  return items.flatMap((item) => {
    const product = products.get(item.productId);
    return product && product.isActive ? [toLine(product, item.quantity)] : [];
  });
}
