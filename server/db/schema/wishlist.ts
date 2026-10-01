import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { products } from "./catalog";
import { createdAt } from "./_shared";

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productId] })],
);
