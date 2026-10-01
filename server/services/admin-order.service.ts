import "server-only";
import type { OrderStatus } from "@/lib/config/shop";
import { canTransition } from "@/lib/orders/transitions";
import type { AdminOrderDetail, AdminOrderRow, DashboardStats } from "@/lib/types/admin";
import type { Paginated } from "@/lib/types/catalog";
import { withTransaction } from "@/server/db/client";
import * as adminOrderRepo from "@/server/repositories/admin-order.repo";
import type { AdminOrderFilters } from "@/server/repositories/admin-order.repo";
import * as catalogRepo from "@/server/repositories/admin-catalog.repo";
import * as orderRepo from "@/server/repositories/order.repo";
import * as productRepo from "@/server/repositories/product.repo";
import { ServiceError } from "./errors";
import { toOrderDetail } from "./order.service";

const toRow = (o: adminOrderRepo.AdminOrderListRow): AdminOrderRow => ({
  id: o.id,
  orderNumber: o.orderNumber,
  email: o.email,
  status: o.status,
  paymentStatus: o.paymentStatus,
  paymentMethod: o.paymentMethod,
  total: o.total,
  itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
  placedAt: o.placedAt.toISOString(),
});

export async function listOrders(filters: AdminOrderFilters): Promise<Paginated<AdminOrderRow> & { counts: Record<string, number> }> {
  const [{ rows, total }, counts] = await Promise.all([adminOrderRepo.listAdminOrders(filters), adminOrderRepo.statusCounts()]);
  return {
    items: rows.map(toRow),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    counts,
  };
}

export async function getOrder(orderNumber: string): Promise<AdminOrderDetail | null> {
  const row = await orderRepo.getOrderByNumber(orderNumber.toUpperCase());
  if (!row) return null;
  const emails = await adminOrderRepo.listEmailLogs(row.id);
  return {
    ...toOrderDetail(row),
    userId: row.userId,
    confirmationEmailSentAt: row.confirmationEmailSentAt?.toISOString() ?? null,
    emails: emails.map((e) => ({ id: e.id, template: e.template, to: e.to, status: e.status, error: e.error, createdAt: e.createdAt.toISOString() })),
  };
}

export interface StatusChange {
  orderId: string;
  userId: string | null;
  status: OrderStatus;
  note: string | null;
}

/**
 * Move an order along its lifecycle. Illegal jumps are rejected. Cancelling puts stock back,
 * and delivering a pay-on-delivery order marks it paid (the cash was collected).
 */
export async function changeStatus(adminId: string, orderNumber: string, to: OrderStatus, note?: string): Promise<StatusChange> {
  const order = await orderRepo.getOrderByNumber(orderNumber.toUpperCase());
  if (!order) throw new ServiceError("That order no longer exists.");
  if (!canTransition(order.status, to)) {
    throw new ServiceError(`An order that is ${order.status} can't be moved to ${to}.`);
  }

  await withTransaction(async (tx) => {
    let paymentStatus = order.paymentStatus;
    if (to === "delivered" && order.paymentMethod === "pay_on_delivery" && paymentStatus === "unpaid") paymentStatus = "paid";
    if (to === "cancelled") {
      for (const item of order.items) if (item.productId) await productRepo.incrementStock(item.productId, item.quantity, tx);
      if (paymentStatus === "paid") paymentStatus = "refunded";
    }
    await adminOrderRepo.setStatus(order.id, { status: to, paymentStatus }, tx);
    await adminOrderRepo.addEvent({ orderId: order.id, status: to, note: note || null, createdBy: adminId }, tx);
  });
  return { orderId: order.id, userId: order.userId, status: to, note: note || null };
}

export async function markPaid(adminId: string, orderNumber: string): Promise<void> {
  const order = await orderRepo.getOrderByNumber(orderNumber.toUpperCase());
  if (!order) throw new ServiceError("That order no longer exists.");
  if (order.status === "cancelled") throw new ServiceError("A cancelled order can't be marked paid.");
  if (order.paymentStatus === "paid") return;
  await withTransaction(async (tx) => {
    await adminOrderRepo.setPaymentStatus(order.id, "paid", tx);
    await adminOrderRepo.addEvent({ orderId: order.id, status: order.status, note: "Payment received", createdBy: adminId }, tx);
  });
}

export async function getOrderIdentity(orderNumber: string) {
  const o = await orderRepo.getOrderByNumber(orderNumber.toUpperCase());
  return o ? { id: o.id, userId: o.userId } : null;
}

// ── dashboard ──────────────────────────────────────────────────────
export async function getDashboard(): Promise<DashboardStats> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const days30 = new Date(Date.now() - 30 * 86_400_000);

  const [today, month, daily, top, recent, counts, low, out] = await Promise.all([
    adminOrderRepo.revenueSince(startOfToday),
    adminOrderRepo.revenueSince(days30),
    adminOrderRepo.dailyRevenue(14),
    adminOrderRepo.topProducts(days30, 5),
    adminOrderRepo.listAdminOrders({ page: 1, pageSize: 6 }),
    adminOrderRepo.statusCounts(),
    catalogRepo.listAdminProducts({ status: "low", page: 1, pageSize: 1 }),
    catalogRepo.listAdminProducts({ status: "out", page: 1, pageSize: 1 }),
  ]);

  return {
    revenueToday: today.revenue,
    revenue30d: month.revenue,
    orders30d: month.n,
    averageOrder30d: month.n > 0 ? Math.round(month.revenue / month.n) : 0,
    awaitingAction: (counts.confirmed ?? 0) + (counts.processing ?? 0) + (counts.pending ?? 0),
    lowStock: low.total,
    outOfStock: out.total,
    recentOrders: recent.rows.map(toRow),
    topProducts: top,
    daily,
  };
}
