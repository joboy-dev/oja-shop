import { getCart } from "@/server/services/cart.service";
import { route } from "../_lib/handler";

export const GET = route({ access: "user" }, ({ user }) => getCart(user.id));
