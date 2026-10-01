import "server-only";
import type { ProductSummary } from "@/lib/types/catalog";
import * as wishlistRepo from "@/server/repositories/wishlist.repo";
import { ServiceError } from "./errors";
import { toProductSummary } from "./mappers";

export function getWishlistIds(userId: string): Promise<string[]> {
  return wishlistRepo.listWishlistProductIds(userId);
}

export async function getWishlistProducts(userId: string): Promise<ProductSummary[]> {
  const rows = await wishlistRepo.listWishlist(userId);
  return rows.filter((r) => r.product?.isActive).map((r) => toProductSummary(r.product));
}

/** Flip membership and return the new state. */
export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    if (await wishlistRepo.isWished(userId, productId)) {
      await wishlistRepo.removeWishlistItem(userId, productId);
      return false;
    }
    await wishlistRepo.addWishlistItem(userId, productId);
    return true;
  } catch {
    // A foreign-key failure means the product no longer exists.
    throw new ServiceError("That product is no longer available.");
  }
}
