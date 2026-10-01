import "server-only";
import type { PaymentMethodId, ShippingMethodId } from "@/lib/config/shop";
import type { OrderDetailDTO, OrderItemDTO, OrderSummaryDTO } from "@/lib/types/order";
import type { OrderDetailRow, OrderListRow } from "@/server/repositories/order.repo";
import * as orderRepo from "@/server/repositories/order.repo";
import { resolveImageUrl } from "./mappers";

const itemImage = (i: { imageStorageKey: string | null; imageExternalUrl: string | null }) =>
  resolveImageUrl({ storageKey: i.imageStorageKey, externalUrl: i.imageExternalUrl });

function toSummary(row: OrderListRow | OrderDetailRow): OrderSummaryDTO {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    paymentStatus: row.paymentStatus,
    paymentMethod: row.paymentMethod as PaymentMethodId,
    total: row.total,
    itemCount: row.items.reduce((n, i) => n + i.quantity, 0),
    placedAt: row.placedAt.toISOString(),
    thumbnails: row.items.map(itemImage).filter((u): u is string => !!u).slice(0, 4),
  };
}

export function toOrderDetail(row: OrderDetailRow): OrderDetailDTO {
  const items: OrderItemDTO[] = row.items.map((i) => ({
    id: i.id,
    productId: i.productId,
    name: i.productName,
    slug: i.productSlug,
    imageUrl: itemImage(i),
    unitPrice: i.unitPrice,
    quantity: i.quantity,
    lineTotal: i.lineTotal,
  }));
  return {
    ...toSummary(row),
    email: row.email,
    phone: row.phone,
    subtotal: row.subtotal,
    shippingFee: row.shippingFee,
    discount: row.discount,
    shippingMethod: row.shippingMethod as ShippingMethodId,
    shippingAddress: row.shippingAddress,
    notes: row.notes,
    items,
    events: [...row.events]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((e) => ({ id: e.id, status: e.status, note: e.note, createdAt: e.createdAt.toISOString() })),
  };
}

export async function getUserOrders(userId: string, limit?: number): Promise<OrderSummaryDTO[]> {
  return (await orderRepo.listOrdersForUser(userId, limit)).map(toSummary);
}

export async function getUserOrder(userId: string, orderNumber: string): Promise<OrderDetailDTO | null> {
  const row = await orderRepo.getOrderForUser(userId, orderNumber.toUpperCase());
  return row ? toOrderDetail(row) : null;
}
