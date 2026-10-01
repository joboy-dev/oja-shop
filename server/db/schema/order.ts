import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orderStatuses, paymentMethodIds, paymentStatuses } from "@/lib/config/shop";
import type { ShippingAddress } from "@/lib/types/address";
import { users } from "./auth";
import { products } from "./catalog";
import { createdAt, updatedAt } from "./_shared";

export const orderStatus = pgEnum("order_status", orderStatuses);
export const paymentMethod = pgEnum("payment_method", paymentMethodIds);
export const paymentStatus = pgEnum("payment_status", paymentStatuses);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    /** Nullable so order history survives account deletion. */
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    status: orderStatus("status").notNull().default("confirmed"),
    paymentMethod: paymentMethod("payment_method").notNull(),
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
    subtotal: integer("subtotal").notNull(),
    shippingFee: integer("shipping_fee").notNull(),
    discount: integer("discount").notNull().default(0),
    total: integer("total").notNull(),
    currency: text("currency").notNull().default("NGN"),
    shippingMethod: text("shipping_method").notNull(),
    /** Snapshot of the address at purchase time. */
    shippingAddress: jsonb("shipping_address").$type<ShippingAddress>().notNull(),
    notes: text("notes"),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    confirmationEmailSentAt: timestamp("confirmation_email_sent_at", { withTimezone: true }),
    placedAt: timestamp("placed_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("orders_user_idx").on(t.userId, t.placedAt), index("orders_status_idx").on(t.status)],
);

/** Snapshot rows: editing or deleting a product never rewrites order history. */
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    productSlug: text("product_slug").notNull(),
    imageStorageKey: text("image_storage_key"),
    imageExternalUrl: text("image_external_url"),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderStatusEvents = pgTable(
  "order_status_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatus("status").notNull(),
    note: text("note"),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [index("order_status_events_order_idx").on(t.orderId, t.createdAt)],
);
