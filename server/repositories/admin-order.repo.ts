import "server-only";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import type { OrderStatus, PaymentStatus } from "@/lib/config/shop";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { orders, orderItems, orderStatusEvents, emailLogs } = schema;

export interface AdminOrderFilters {
  status?: OrderStatus;
  q?: string;
  page: number;
  pageSize: number;
}

function where(f: AdminOrderFilters): SQL | undefined {
  const c: (SQL | undefined)[] = [];
  if (f.status) c.push(eq(orders.status, f.status));
  if (f.q) {
    const like = `%${f.q.replace(/[%_\\]/g, "\\$&")}%`;
    c.push(or(ilike(orders.orderNumber, like), ilike(orders.email, like)));
  }
  return and(...c);
}

export async function listAdminOrders(f: AdminOrderFilters) {
  const w = where(f);
  const [rows, [{ total }]] = await Promise.all([
    db.query.orders.findMany({
      where: w,
      orderBy: [desc(orders.placedAt)],
      limit: f.pageSize,
      offset: (f.page - 1) * f.pageSize,
      with: { items: true },
    }),
    db.select({ total: count() }).from(orders).where(w),
  ]);
  return { rows, total };
}
export type AdminOrderListRow = Awaited<ReturnType<typeof listAdminOrders>>["rows"][number];

export async function statusCounts(): Promise<Record<string, number>> {
  const rows = await db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status);
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

export function listEmailLogs(orderId: string) {
  return db.select().from(emailLogs).where(eq(emailLogs.orderId, orderId)).orderBy(desc(emailLogs.createdAt));
}

export async function setStatus(
  orderId: string,
  patch: { status: OrderStatus; paymentStatus?: PaymentStatus },
  executor: DbExecutor = db,
) {
  await executor.update(orders).set(patch).where(eq(orders.id, orderId));
}

export async function setPaymentStatus(orderId: string, paymentStatus: PaymentStatus, executor: DbExecutor = db) {
  await executor.update(orders).set({ paymentStatus }).where(eq(orders.id, orderId));
}

export async function addEvent(
  event: { orderId: string; status: OrderStatus; note?: string | null; createdBy?: string | null },
  executor: DbExecutor = db,
) {
  await executor.insert(orderStatusEvents).values(event);
}

// ── dashboard aggregates ───────────────────────────────────────────
const live = sql`${orders.status} <> 'cancelled'`;

export async function revenueSince(since: Date) {
  const [r] = await db
    .select({ revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`, n: count() })
    .from(orders)
    .where(and(live, sql`${orders.placedAt} >= ${since.toISOString()}`));
  return r;
}

export async function dailyRevenue(days: number) {
  const rows = await db.execute(sql`
    select to_char(d::date, 'YYYY-MM-DD') as date,
           coalesce(sum(o.total) filter (where o.status <> 'cancelled'), 0)::int as revenue,
           count(o.id) filter (where o.status <> 'cancelled')::int as orders
    from generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') d
    left join orders o on o.placed_at::date = d::date
    group by d order by d`);
  return (rows as unknown as { rows: { date: string; revenue: number; orders: number }[] }).rows;
}

export async function topProducts(since: Date, limit: number) {
  return db
    .select({
      name: orderItems.productName,
      slug: orderItems.productSlug,
      units: sql<number>`sum(${orderItems.quantity})::int`,
      revenue: sql<number>`sum(${orderItems.lineTotal})::int`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(and(live, sql`${orders.placedAt} >= ${since.toISOString()}`))
    .groupBy(orderItems.productName, orderItems.productSlug)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(limit);
}
