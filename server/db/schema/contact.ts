import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "./_shared";

export const contactStatus = pgEnum("contact_status", ["new", "read"]);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: contactStatus("status").notNull().default("new"),
  createdAt: createdAt(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: createdAt(),
});
