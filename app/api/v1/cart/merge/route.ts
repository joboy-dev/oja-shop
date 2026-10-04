import { cartItemsSchema } from "@/lib/validators/cart";
import { mergeGuestCart } from "@/server/services/cart.service";
import { readJson, route } from "../../_lib/handler";

/** Called once after sign-in with the device's guest cart. */
export const POST = route({ access: "user" }, async ({ req, user }) => {
  const { items } = await readJson(req, cartItemsSchema, "Your bag couldn't be restored.");
  return mergeGuestCart(user.id, items);
});
