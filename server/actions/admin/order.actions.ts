"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { fail, type ActionResult } from "@/lib/types/action-result";
import { orderNumberSchema, orderStatusChangeSchema } from "@/lib/validators/admin";
import * as orders from "@/server/services/admin-order.service";
import { notifyOrderStatusChanged, resendOrderConfirmation } from "@/server/services/notification.service";
import { ServiceError } from "@/server/services/errors";
import { runAdmin } from "./_run";

const refresh = (orderNumber: string) => {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath(`/account/orders/${orderNumber}`);
};

export async function updateOrderStatusAction(input: unknown): Promise<ActionResult> {
  const parsed = orderStatusChangeSchema.safeParse(input);
  if (!parsed.success) return fail("Choose a valid status.");
  const { orderNumber, status, note } = parsed.data;
  return runAdmin("order-status", async (admin) => {
    const change = await orders.changeStatus(admin.id, orderNumber, status, note);
    refresh(orderNumber);
    // The customer is emailed after the response; a mail problem never blocks the admin.
    after(() => notifyOrderStatusChanged(change.orderId, change.userId, change.status, change.note));
  });
}

export async function markOrderPaidAction(input: unknown): Promise<ActionResult> {
  const parsed = orderNumberSchema.safeParse(input);
  if (!parsed.success) return fail("That order can't be updated.");
  return runAdmin("order-paid", async (admin) => {
    await orders.markPaid(admin.id, parsed.data.orderNumber);
    refresh(parsed.data.orderNumber);
  });
}

export async function resendConfirmationAction(input: unknown): Promise<ActionResult> {
  const parsed = orderNumberSchema.safeParse(input);
  if (!parsed.success) return fail("That order can't be emailed.");
  return runAdmin("resend-confirmation", async () => {
    const order = await orders.getOrderIdentity(parsed.data.orderNumber);
    if (!order) throw new ServiceError("That order no longer exists.");
    const result = await resendOrderConfirmation(order.id, order.userId);
    refresh(parsed.data.orderNumber);
    if (!result.ok) throw new ServiceError(`The email couldn't be sent: ${result.error ?? "unknown error"}`);
  });
}
