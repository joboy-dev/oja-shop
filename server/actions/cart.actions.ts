"use server";

import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import type { CartLine } from "@/lib/types/cart";
import { cartItemSchema, cartItemsSchema, removeItemSchema, setQuantitySchema } from "@/lib/validators/cart";
import { authorize } from "@/server/auth/session";
import * as cartService from "@/server/services/cart.service";
import { ServiceError } from "@/server/services/errors";

type CartResult = ActionResult<CartLine[]>;

async function run(fn: (userId: string) => Promise<CartLine[]>): Promise<CartResult> {
  const session = await authorize();
  if (!session.ok) return fail(session.error);
  try {
    return ok(await fn(session.user.id));
  } catch (err) {
    if (err instanceof ServiceError) return fail(err.message);
    console.error("[cart action]", err);
    return fail("Something went wrong with your bag. Please try again.");
  }
}

export async function getCartAction(): Promise<CartResult> {
  return run((userId) => cartService.getCart(userId));
}

export async function addToCartAction(input: unknown): Promise<CartResult> {
  const parsed = cartItemSchema.safeParse(input);
  if (!parsed.success) return fail("That item can't be added.");
  return run((userId) => cartService.addItem(userId, parsed.data));
}

export async function setCartQuantityAction(input: unknown): Promise<CartResult> {
  const parsed = setQuantitySchema.safeParse(input);
  if (!parsed.success) return fail("That quantity isn't valid.");
  return run((userId) => cartService.setQuantity(userId, parsed.data.productId, parsed.data.quantity));
}

export async function removeFromCartAction(input: unknown): Promise<CartResult> {
  const parsed = removeItemSchema.safeParse(input);
  if (!parsed.success) return fail("That item can't be removed.");
  return run((userId) => cartService.removeItem(userId, parsed.data.productId));
}

/** Called once after sign-in with the browser's guest cart. */
export async function mergeGuestCartAction(input: unknown): Promise<CartResult> {
  const parsed = cartItemsSchema.safeParse(input);
  if (!parsed.success) return fail("Your bag couldn't be restored.");
  return run((userId) => cartService.mergeGuestCart(userId, parsed.data.items));
}

/** Public: refreshes a guest's browser cart with current prices and stock. */
export async function resolveGuestCartAction(input: unknown): Promise<CartResult> {
  const parsed = cartItemsSchema.safeParse(input);
  if (!parsed.success) return fail("Your bag couldn't be refreshed.");
  try {
    return ok(await cartService.resolveGuestCart(parsed.data.items));
  } catch (err) {
    console.error("[resolveGuestCart]", err);
    return fail("Couldn't refresh your bag.");
  }
}
