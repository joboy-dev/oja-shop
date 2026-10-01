"use server";

import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import { wishlistSchema } from "@/lib/validators/cart";
import { authorize } from "@/server/auth/session";
import { ServiceError } from "@/server/services/errors";
import * as wishlistService from "@/server/services/wishlist.service";

export async function toggleWishlistAction(input: unknown): Promise<ActionResult<{ wished: boolean }>> {
  const session = await authorize();
  if (!session.ok) return fail(session.error);
  const parsed = wishlistSchema.safeParse(input);
  if (!parsed.success) return fail("That product can't be saved.");
  try {
    return ok({ wished: await wishlistService.toggleWishlist(session.user.id, parsed.data.productId) });
  } catch (err) {
    if (err instanceof ServiceError) return fail(err.message);
    console.error("[wishlist action]", err);
    return fail("Couldn't update your wishlist. Try again.");
  }
}
