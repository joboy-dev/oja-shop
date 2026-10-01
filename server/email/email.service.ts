import "server-only";
import { render } from "@react-email/render";
import type { ReactElement } from "react";
import type { OrderStatus } from "@/lib/config/shop";
import type { BankDetails, OrderDetailDTO } from "@/lib/types/order";
import { env } from "@/server/config/env";
import * as emailLogRepo from "@/server/repositories/email-log.repo";
import * as orderRepo from "@/server/repositories/order.repo";
import { toOrderDetail } from "@/server/services/order.service";
import { MailgunError, sendMail } from "./mailgun";
import { ContactNotification } from "./templates/ContactNotification";
import { NewOrderAlert } from "./templates/NewOrderAlert";
import { OrderConfirmation } from "./templates/OrderConfirmation";
import { OrderStatusUpdate } from "./templates/OrderStatusUpdate";
import { Welcome } from "./templates/Welcome";

const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
const first = (name: string) => name.trim().split(/\s+/)[0] || "there";

export interface DeliveryResult {
  ok: boolean;
  error?: string;
}

interface Delivery {
  to: string;
  subject: string;
  template: string;
  element: ReactElement;
  orderId?: string;
  replyTo?: string;
}

/**
 * Render, send, and log. Never throws: a mail problem must not fail the request that triggered it.
 * Every attempt (sent or failed) is recorded in email_logs so admins can see and retry.
 */
async function deliver({ to, subject, template, element, orderId, replyTo }: Delivery): Promise<DeliveryResult> {
  try {
    const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
    const { id } = await sendMail({ to, subject, html, text, tags: [template], replyTo });
    await emailLogRepo.insertEmailLog({ to, subject, template, status: "sent", providerMessageId: id, orderId });
    return { ok: true };
  } catch (err) {
    const message = err instanceof MailgunError ? err.message : (err as Error).message;
    console.error(`[email:${template}] ${to}: ${message}`);
    await emailLogRepo
      .insertEmailLog({ to, subject, template, status: "failed", error: message.slice(0, 500), orderId })
      .catch((e) => console.error("[email] could not write email_logs:", e));
    return { ok: false, error: message };
  }
}

async function loadOrder(orderId: string): Promise<OrderDetailDTO | null> {
  const row = await orderRepo.getOrderById(orderId);
  return row ? toOrderDetail(row) : null;
}

export async function sendOrderConfirmation(orderId: string, customerName: string, bank: BankDetails | null): Promise<DeliveryResult> {
  const order = await loadOrder(orderId);
  if (!order) return { ok: false, error: "Order not found" };
  const result = await deliver({
    to: order.email,
    subject: `Order ${order.orderNumber} confirmed`,
    template: "order-confirmation",
    orderId,
    element: OrderConfirmation({ order, firstName: first(customerName), bank, appUrl }),
  });
  if (result.ok) await orderRepo.markConfirmationSent(orderId);
  return result;
}

export async function sendNewOrderAlert(orderId: string): Promise<DeliveryResult> {
  const order = await loadOrder(orderId);
  if (!order) return { ok: false, error: "Order not found" };
  return deliver({
    to: env.SHOP_NOTIFICATIONS_EMAIL,
    subject: `New order ${order.orderNumber}`,
    template: "new-order-alert",
    orderId,
    replyTo: order.email,
    element: NewOrderAlert({ order, appUrl }),
  });
}

export async function sendOrderStatusUpdate(orderId: string, customerName: string, status: OrderStatus, note?: string | null): Promise<DeliveryResult> {
  const order = await loadOrder(orderId);
  if (!order) return { ok: false, error: "Order not found" };
  return deliver({
    to: order.email,
    subject: `Order ${order.orderNumber}: ${status}`,
    template: `order-${status}`,
    orderId,
    element: OrderStatusUpdate({ order, status, note, firstName: first(customerName), appUrl }),
  });
}

export function sendWelcome(to: string, name: string): Promise<DeliveryResult> {
  return deliver({ to, subject: "Welcome to Ọjà", template: "welcome", element: Welcome({ firstName: first(name), appUrl }) });
}

export function sendContactNotification(input: { name: string; email: string; subject: string; message: string }): Promise<DeliveryResult> {
  return deliver({
    to: env.SHOP_NOTIFICATIONS_EMAIL,
    subject: `Contact: ${input.subject}`,
    template: "contact",
    replyTo: input.email,
    element: ContactNotification({ ...input, appUrl }),
  });
}
