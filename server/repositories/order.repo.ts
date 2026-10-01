import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { orders, orderItems, orderStatusEvents } = schema;

export type NewOrder = typeof orders.$inferInsert;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderStatusValue = (typeof orders.$inferSelect)["status"];

export async function insertOrder(values: NewOrder, executor: DbExecutor = db) {
  const [row] = await executor.insert(orders).values(values).returning();
  return row;
}

export async function insertOrderItems(rows: NewOrderItem[], executor: DbExecutor = db) {
  if (rows.length > 0) await executor.insert(orderItems).values(rows);
}

export async function insertStatusEvent(
  event: { orderId: string; status: OrderStatusValue; note?: string | null; createdBy?: string | null },
  executor: DbExecutor = db,
) {
  await executor.insert(orderStatusEvents).values(event);
}

export async function findByIdempotencyKey(userId: string, key: string) {
  const [row] = await db
    .select({ id: orders.id, orderNumber: orders.orderNumber })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.idempotencyKey, key)));
  return row ?? null;
}

const detailWith = { items: true, events: true } as const;

export function getOrderForUser(userId: string, orderNumber: string) {
  return db.query.orders.findFirst({
    where: and(eq(orders.userId, userId), eq(orders.orderNumber, orderNumber)),
    with: detailWith,
  });
}

export function getOrderByNumber(orderNumber: string) {
  return db.query.orders.findFirst({ where: eq(orders.orderNumber, orderNumber), with: detailWith });
}

export function getOrderById(id: string) {
  return db.query.orders.findFirst({ where: eq(orders.id, id), with: detailWith });
}

export type OrderDetailRow = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;

export function listOrdersForUser(userId: string, limit?: number) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: [desc(orders.placedAt)],
    limit,
    with: { items: true },
  });
}
export type OrderListRow = Awaited<ReturnType<typeof listOrdersForUser>>[number];

export async function markConfirmationSent(orderId: string) {
  await db.update(orders).set({ confirmationEmailSentAt: new Date() }).where(eq(orders.id, orderId));
}

export const isUniqueViolation = (err: unknown) =>
  typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
