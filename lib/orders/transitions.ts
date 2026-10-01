import type { OrderStatus } from "@/lib/config/shop";

/** Which statuses an order may move to next. Delivered and cancelled are final. */
const next: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "shipped", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const allowedNextStatuses = (from: OrderStatus): OrderStatus[] => next[from];
export const canTransition = (from: OrderStatus, to: OrderStatus) => next[from].includes(to);
export const isFinalStatus = (s: OrderStatus) => next[s].length === 0;
