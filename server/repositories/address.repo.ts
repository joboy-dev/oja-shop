import "server-only";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db, schema, type DbExecutor } from "@/server/db/client";

const { addresses } = schema;
export type AddressRow = typeof addresses.$inferSelect;
export type NewAddress = Omit<typeof addresses.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt">;

export function listAddresses(userId: string, executor: DbExecutor = db): Promise<AddressRow[]> {
  return executor.select().from(addresses).where(eq(addresses.userId, userId)).orderBy(desc(addresses.isDefault), asc(addresses.createdAt));
}

export async function getAddress(userId: string, id: string, executor: DbExecutor = db): Promise<AddressRow | null> {
  const [row] = await executor.select().from(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
  return row ?? null;
}

export async function insertAddress(userId: string, values: NewAddress, executor: DbExecutor = db): Promise<AddressRow> {
  const [row] = await executor.insert(addresses).values({ ...values, userId }).returning();
  return row;
}

export async function updateAddress(userId: string, id: string, values: Partial<NewAddress>, executor: DbExecutor = db) {
  const [row] = await executor
    .update(addresses)
    .set(values)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .returning();
  return row ?? null;
}

export async function deleteAddress(userId: string, id: string, executor: DbExecutor = db) {
  await executor.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
}

/** Make `id` the only default for this user. */
export async function setDefaultAddress(userId: string, id: string, executor: DbExecutor = db) {
  await executor.update(addresses).set({ isDefault: false }).where(and(eq(addresses.userId, userId), ne(addresses.id, id)));
  await executor.update(addresses).set({ isDefault: true }).where(and(eq(addresses.userId, userId), eq(addresses.id, id)));
}
