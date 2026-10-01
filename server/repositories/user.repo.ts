import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/server/db/client";

const { users, orders } = schema;

export async function getUserName(id: string): Promise<string | null> {
  const [row] = await db.select({ name: users.name }).from(users).where(eq(users.id, id));
  return row?.name ?? null;
}

/** Customers with order count and lifetime spend, for the admin. */
export function listCustomers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
      orderCount: sql<number>`count(${orders.id})::int`,
      totalSpent: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} <> 'cancelled'), 0)::int`,
    })
    .from(users)
    .leftJoin(orders, eq(orders.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));
}
