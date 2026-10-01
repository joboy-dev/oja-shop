import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/server/db/client";

const { emailLogs } = schema;
export type NewEmailLog = typeof emailLogs.$inferInsert;

export async function insertEmailLog(row: NewEmailLog) {
  await db.insert(emailLogs).values(row);
}

export function listEmailLogsForOrder(orderId: string) {
  return db.select().from(emailLogs).where(eq(emailLogs.orderId, orderId)).orderBy(desc(emailLogs.createdAt));
}
