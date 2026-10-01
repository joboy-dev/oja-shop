"use client";

import Image from "next/image";
import { selectSubtotal, useCartStore } from "@/components/cart/cart-store";
import { shippingMethods, type ShippingMethodId } from "@/lib/config/shop";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import { formatMoney } from "@/lib/utils/money";

export function OrderSummary({ shippingMethod }: { shippingMethod: ShippingMethodId }) {
  const lines = useCartStore((s) => s.lines).filter((l) => l.available);
  const subtotal = useCartStore(selectSubtotal);
  const totals = calculateTotals(
    lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })),
    shippingMethod,
  );

  return (
    <div>
      <ul className="divide-y divide-border">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center gap-4 py-3.5 first:pt-0">
            <div className="relative h-16 w-14 shrink-0">
              <div className="relative h-full w-full overflow-hidden rounded-lg bg-surface-2">
                {l.imageUrl && <Image src={l.imageUrl} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-fg px-1 font-mono text-[0.6875rem] font-semibold text-background">
                {l.quantity}
              </span>
            </div>
            <p className="min-w-0 flex-1 text-[0.9375rem] font-medium leading-snug">{l.name}</p>
            <p className="font-mono text-sm tabular">{formatMoney(l.unitPrice * l.quantity)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt className="text-fg-muted">Subtotal</dt>
          <dd className="font-mono tabular">{formatMoney(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-fg-muted">{shippingMethods[shippingMethod].label}</dt>
          <dd className="font-mono tabular">{totals.shippingFee === 0 ? "Free" : formatMoney(totals.shippingFee)}</dd>
        </div>
        {shippingMethod === "standard" && !totals.freeShippingApplied && totals.amountToFreeShipping > 0 && (
          <p className="text-sm text-fg-muted">
            Add <span className="font-mono tabular">{formatMoney(totals.amountToFreeShipping)}</span> more for free delivery.
          </p>
        )}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-medium">Total</span>
        <span className="font-mono text-2xl font-medium tabular">{formatMoney(totals.total)}</span>
      </div>
    </div>
  );
}
