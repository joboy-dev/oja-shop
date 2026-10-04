import { getWishlistProducts } from "@/server/services/wishlist.service";
import { route } from "../_lib/handler";

export const GET = route({ access: "user" }, ({ user }) => getWishlistProducts(user.id));
