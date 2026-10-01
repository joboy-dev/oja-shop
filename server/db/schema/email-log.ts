import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./order";
import { createdAt } from "./_shared";

export const emailStatus = pgEnum("email_status", ["sent", "failed"]);

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    to: text("to").notNull(),
    template: text("template").notNull(),
    subject: text("subject").notNull(),
    status: emailStatus("status").notNull(),
    providerMessageId: text("provider_message_id"),
    error: text("error"),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [index("email_logs_order_idx").on(t.orderId)],
);
