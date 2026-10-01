import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "./_shared";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageStorageKey: text("image_storage_key"),
  imageExternalUrl: text("image_external_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    /** Integer kobo. */
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    stock: integer("stock").notNull().default(0),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    materials: text("materials"),
    care: text("care"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("products_category_idx").on(t.categoryId),
    index("products_active_created_idx").on(t.isActive, t.createdAt),
    check("products_price_positive", sql`${t.price} >= 0`),
    check("products_stock_non_negative", sql`${t.stock} >= 0`),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Key in the Neon bucket. Exactly one of storageKey / externalUrl is set. */
    storageKey: text("storage_key"),
    externalUrl: text("external_url"),
    alt: text("alt").notNull().default(""),
    position: integer("position").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
  },
  (t) => [
    index("product_images_product_idx").on(t.productId, t.position),
    check("product_images_one_source", sql`(${t.storageKey} is null) <> (${t.externalUrl} is null)`),
  ],
);
