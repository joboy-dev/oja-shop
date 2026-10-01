import "server-only";
import type { OrderStatus } from "@/lib/config/shop";
import type { ContactInput } from "@/lib/validators/contact";
import * as email from "@/server/email/email.service";
import { getBankDetails } from "./payment.service";
import { getCustomerName } from "./user.service";

/**
 * One function per business event. Actions call these inside `after()`, so the user
 * gets their response first and a Mailgun hiccup can never fail an order.
 */
export async function notifyOrderPlaced(orderId: string, customerName: string) {
  const results = await Promise.allSettled([
    email.sendOrderConfirmation(orderId, customerName, getBankDetails()),
    email.sendNewOrderAlert(orderId),
  ]);
  // deliver() never throws, so a rejection here means a bug before sending; make it loud.
  for (const r of results) if (r.status === "rejected") console.error("[notifyOrderPlaced]", r.reason);
}

export async function notifyOrderStatusChanged(orderId: string, userId: string | null, status: OrderStatus, note?: string | null) {
  if (status === "pending") return;
  const name = userId ? await getCustomerName(userId) : "there";
  await email.sendOrderStatusUpdate(orderId, name, status, note);
}

export async function resendOrderConfirmation(orderId: string, userId: string | null) {
  const name = userId ? await getCustomerName(userId) : "there";
  return email.sendOrderConfirmation(orderId, name, getBankDetails());
}

export async function notifyContactMessage(input: ContactInput) {
  await email.sendContactNotification(input);
}

export async function notifyWelcome(to: string, name: string) {
  await email.sendWelcome(to, name);
}
