import { cartItemsSchema } from "@/lib/validators/cart";
import { resolveGuestCart } from "@/server/services/cart.service";
import { readJson, route } from "../../_lib/handler";

/** Public: refreshes a guest bag with current prices and stock. */
export const POST = route({}, async ({ req }) => {
  const { items } = await readJson(req, cartItemsSchema, "Your bag couldn't be refreshed.");
  return resolveGuestCart(items);
});
