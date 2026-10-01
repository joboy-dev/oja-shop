"use server";

import { updateTag } from "next/cache";
import { after } from "next/server";
import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import { checkoutSchema } from "@/lib/validators/checkout";
import { authorize } from "@/server/auth/session";
import { placeOrder } from "@/server/services/checkout.service";
import { ServiceError } from "@/server/services/errors";
import { notifyOrderPlaced } from "@/server/services/notification.service";

export async function placeOrderAction(input: unknown): Promise<ActionResult<{ orderNumber: string }>> {
  const session = await authorize();
  if (!session.ok) return fail(session.error);

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);

  try {
    const placed = await placeOrder(session.user, parsed.data);
    if (!placed.duplicate) {
      // Stock changed: expire cached product pages so the next view shows real availability.
      updateTag("products");
      // Emails go out after the response, so a mail outage can never fail or slow an order.
      after(() => notifyOrderPlaced(placed.orderId, session.user.name));
    }
    return ok({ orderNumber: placed.orderNumber });
  } catch (err) {
    if (err instanceof ServiceError) return fail(err.message, err.fieldErrors);
    console.error("[placeOrder]", err);
    return fail("We couldn't place your order. You haven't been charged. Please try again.");
  }
}
