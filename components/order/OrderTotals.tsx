import type { OrderDetailDTO } from "@/lib/types/order";
import { formatMoney } from "@/lib/utils/money";

export function OrderTotals({ order }: { order: Pick<OrderDetailDTO, "subtotal" | "shippingFee" | "discount" | "total"> }) {
  return (
    <dl className="space-y-2.5 text-[0.9375rem]">
      <div className="flex justify-between">
        <dt className="text-fg-muted">Subtotal</dt>
        <dd className="font-mono tabular">{formatMoney(order.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-fg-muted">Delivery</dt>
        <dd className="font-mono tabular">{order.shippingFee === 0 ? "Free" : formatMoney(order.shippingFee)}</dd>
      </div>
      {order.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-fg-muted">Discount</dt>
          <dd className="font-mono tabular">−{formatMoney(order.discount)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <dt className="font-medium">Total</dt>
        <dd className="font-mono text-xl font-medium tabular">{formatMoney(order.total)}</dd>
      </div>
    </dl>
  );
}
