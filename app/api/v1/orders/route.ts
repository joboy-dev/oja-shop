import { getUserOrders } from "@/server/services/order.service";
import { route } from "../_lib/handler";

export const GET = route({ access: "user" }, ({ user }) => getUserOrders(user.id));
