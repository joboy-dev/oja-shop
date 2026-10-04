import { wishlistSchema } from "@/lib/validators/cart";
import { toggleWishlist } from "@/server/services/wishlist.service";
import { readJson, route } from "../../_lib/handler";

export const POST = route({ access: "user" }, async ({ req, user }) => {
  const { productId } = await readJson(req, wishlistSchema, "That product can't be saved.");
  return { wished: await toggleWishlist(user.id, productId) };
});
