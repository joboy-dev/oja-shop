import "server-only";
import { shippingMethods } from "@/lib/config/shop";
import { maxPurchasable } from "@/lib/cart/merge";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import type { ShippingAddress } from "@/lib/types/address";
import { generateOrderNumber } from "@/lib/utils/order-number";
import type { CheckoutValues } from "@/lib/validators/checkout";
import type { SessionUser } from "@/server/auth/session";
import { withTransaction } from "@/server/db/client";
import * as addressRepo from "@/server/repositories/address.repo";
import * as cartRepo from "@/server/repositories/cart.repo";
import * as orderRepo from "@/server/repositories/order.repo";
import * as productRepo from "@/server/repositories/product.repo";
import { ServiceError } from "./errors";
import { toProductSummary } from "./mappers";

export interface PlacedOrder {
  orderId: string;
  orderNumber: string;
  /** True when this call returned an order that already existed (double submit). */
  duplicate: boolean;
}

/**
 * Turns the user's saved cart into an order. Prices, stock and totals all come from the
 * database; nothing the browser sends about money is trusted.
 *
 * One transaction: order + item snapshots + conditional stock decrement + status event +
 * cart clear (+ optional saved address). If anything fails, nothing is written.
 */
export async function placeOrder(user: SessionUser, input: CheckoutValues): Promise<PlacedOrder> {
  // A repeated submit (double click, retry after a timeout) returns the order we already made.
  const existing = await orderRepo.findByIdempotencyKey(user.id, input.idempotencyKey);
  if (existing) return { orderId: existing.id, orderNumber: existing.orderNumber, duplicate: true };

  return withTransaction(async (tx) => {
    // 1. The cart, as stored on the server.
    const cartId = await cartRepo.getOrCreateCartId(user.id, tx);
    const cartItems = await cartRepo.listCartItems(cartId, tx);
    if (cartItems.length === 0) throw new ServiceError("Your bag is empty.");

    // 2. Every line must still be for sale, in the quantity asked for.
    const problems: string[] = [];
    const lines = cartItems.map((item) => {
      const p = item.product;
      if (!p || !p.isActive || p.stock <= 0) problems.push(`${p?.name ?? "An item"} is no longer available`);
      else if (item.quantity > maxPurchasable(p.stock)) problems.push(`Only ${p.stock} of ${p.name} left`);
      return { item, product: p };
    });
    if (problems.length > 0) {
      throw new ServiceError(`${problems.join(". ")}. We've updated your bag, please review it and try again.`);
    }

    // 3. Delivery address: a saved one (must be theirs) or a new one.
    let shippingAddress: ShippingAddress;
    if (input.address.mode === "saved") {
      const saved = await addressRepo.getAddress(user.id, input.address.addressId, tx);
      if (!saved) throw new ServiceError("That delivery address could not be found. Please choose another.");
      shippingAddress = {
        fullName: saved.fullName,
        phone: saved.phone,
        line1: saved.line1,
        line2: saved.line2,
        city: saved.city,
        state: saved.state,
        country: saved.country,
        postalCode: saved.postalCode,
      };
    } else {
      const { mode: _mode, save: _save, ...fields } = input.address;
      void _mode;
      void _save;
      shippingAddress = { ...fields, line2: fields.line2 || null, postalCode: fields.postalCode || null, country: "NG" };
    }

    // 4. Money, from database prices.
    const totals = calculateTotals(
      lines.map(({ item, product }) => ({ unitPrice: product.price, quantity: item.quantity })),
      input.shippingMethod,
    );

    // 5. Write the order. Order numbers are random, so retry on the rare collision.
    let order: Awaited<ReturnType<typeof orderRepo.insertOrder>> | undefined;
    for (let attempt = 0; attempt < 4 && !order; attempt++) {
      try {
        order = await orderRepo.insertOrder(
          {
            orderNumber: generateOrderNumber(),
            userId: user.id,
            email: user.email,
            phone: input.phone,
            status: "confirmed",
            paymentMethod: input.paymentMethod,
            paymentStatus: "unpaid",
            subtotal: totals.subtotal,
            shippingFee: totals.shippingFee,
            discount: totals.discount,
            total: totals.total,
            currency: "NGN",
            shippingMethod: shippingMethods[input.shippingMethod].id,
            shippingAddress,
            notes: input.notes || null,
            idempotencyKey: input.idempotencyKey,
          },
          tx,
        );
      } catch (err) {
        if (!orderRepo.isUniqueViolation(err)) throw err;
        // A unique violation on the idempotency key means a parallel request won the race.
        const raced = await orderRepo.findByIdempotencyKey(user.id, input.idempotencyKey);
        if (raced) throw new ServiceError("Your order is already being placed. Check your orders in a moment.");
      }
    }
    if (!order) throw new ServiceError("We couldn't create your order. Please try again.");

    await orderRepo.insertOrderItems(
      lines.map(({ item, product }) => {
        const first = [...product.images].sort((a, b) => a.position - b.position)[0];
        return {
          orderId: order!.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          imageStorageKey: first?.storageKey ?? null,
          imageExternalUrl: first?.externalUrl ?? null,
          unitPrice: product.price,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      }),
      tx,
    );

    // 6. Take the stock. A zero-row update means someone else bought it first: roll everything back.
    for (const { item, product } of lines) {
      const took = await productRepo.decrementStock(product.id, item.quantity, tx);
      if (!took) throw new ServiceError(`${toProductSummary(product).name} just sold out. We've updated your bag.`);
    }

    await orderRepo.insertStatusEvent({ orderId: order.id, status: "confirmed", note: "Order placed", createdBy: user.id }, tx);
    await cartRepo.clearCart(cartId, tx);

    if (input.address.mode === "new" && input.address.save) {
      const count = (await addressRepo.listAddresses(user.id, tx)).length;
      if (count < 10) {
        const saved = await addressRepo.insertAddress(
          user.id,
          {
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            line1: shippingAddress.line1,
            line2: shippingAddress.line2 ?? null,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: "NG",
            postalCode: shippingAddress.postalCode ?? null,
            isDefault: false,
          },
          tx,
        );
        if (count === 0) await addressRepo.setDefaultAddress(user.id, saved.id, tx);
      }
    }

    return { orderId: order.id, orderNumber: order.orderNumber, duplicate: false };
  });
}
