import { getWishlistIds } from "@/server/services/wishlist.service";
import { route } from "../../_lib/handler";

export const GET = route({ access: "user" }, ({ user }) => getWishlistIds(user.id));
