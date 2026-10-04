import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { checkoutSchema } from "@/lib/validators/checkout";
import { placeOrder } from "@/server/services/checkout.service";
import { notifyOrderPlaced } from "@/server/services/notification.service";
import { readJson, route } from "../_lib/handler";

/** Same flow as placeOrderAction: the server re-reads prices and stock; the idempotency key makes retries safe. */
export const POST = route({ access: "user" }, async ({ req, user }) => {
  const input = await readJson(req, checkoutSchema, "Please check the highlighted fields.");
  const placed = await placeOrder(user, input);
  if (!placed.duplicate) {
    // Stock changed: expire cached catalogue pages so availability is accurate on web and mobile.
    revalidateTag("products", { expire: 0 });
    // Email after the response so a mail outage can never fail or slow an order.
    after(() => notifyOrderPlaced(placed.orderId, user.name));
  }
  return { orderNumber: placed.orderNumber };
});
