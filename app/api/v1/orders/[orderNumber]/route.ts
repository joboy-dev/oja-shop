import { getUserOrder } from "@/server/services/order.service";
import { HttpError, route } from "../../_lib/handler";

export const GET = route<{ orderNumber: string }, "user">({ access: "user" }, async ({ params, user }) => {
  const order = await getUserOrder(user.id, params.orderNumber.slice(0, 40));
  if (!order) throw new HttpError(404, "We couldn't find that order.");
  return order;
});
