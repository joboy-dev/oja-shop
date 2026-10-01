import "server-only";
import { desc, eq } from "drizzle-orm";
import type { ContactInput } from "@/lib/validators/contact";
import { db, schema } from "@/server/db/client";

const { contactMessages, newsletterSubscribers } = schema;

export async function insertContactMessage(input: ContactInput) {
  const [row] = await db.insert(contactMessages).values(input).returning();
  return row;
}

export function listContactMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markContactRead(id: string) {
  await db.update(contactMessages).set({ status: "read" }).where(eq(contactMessages.id, id));
}

/** Returns true if the address was new. */
export async function insertSubscriber(email: string): Promise<boolean> {
  const rows = await db
    .insert(newsletterSubscribers)
    .values({ email: email.toLowerCase() })
    .onConflictDoNothing()
    .returning({ id: newsletterSubscribers.id });
  return rows.length > 0;
}
