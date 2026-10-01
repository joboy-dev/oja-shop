import { relations } from "drizzle-orm";
import { addresses } from "./address";
import { accounts, sessions, users } from "./auth";
import { cartItems, carts } from "./cart";
import { categories, productImages, products } from "./catalog";
import { emailLogs } from "./email-log";
import { orderItems, orderStatusEvents, orders } from "./order";
import { wishlistItems } from "./wishlist";

export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  addresses: many(addresses),
  orders: many(orders),
  cart: one(carts, { fields: [users.id], references: [carts.userId] }),
  wishlist: many(wishlistItems),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({ products: many(products) }));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  events: many(orderStatusEvents),
  emails: many(emailLogs),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderStatusEventsRelations = relations(orderStatusEvents, ({ one }) => ({
  order: one(orders, { fields: [orderStatusEvents.orderId], references: [orders.id] }),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  order: one(orders, { fields: [emailLogs.orderId], references: [orders.id] }),
}));
