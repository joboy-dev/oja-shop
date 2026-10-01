"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import { formatMoney } from "@/lib/utils/money";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingBar } from "./FreeShippingBar";
import { selectSubtotal, useCartStore } from "./cart-store";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const ready = useCartStore((s) => s.ready);
  const subtotal = useCartStore(selectSubtotal);
  const buyable = lines.filter((l) => l.available);
  const totals = calculateTotals(buyable.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })));

  if (!ready && lines.length === 0) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-28 w-[5.5rem] rounded-card" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-72 rounded-card" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Nothing here yet. Our newest adire throws and stoneware are a good place to start."
        action={
          <Button asChild size="lg">
            <Link href="/shop">Browse the shop</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
      <div>
        <FreeShippingBar subtotal={subtotal} />
        <ul className="mt-2 divide-y divide-border border-b border-border">
          {lines.map((line) => (
            <CartLineItem key={line.productId} line={line} />
          ))}
        </ul>
      </div>

      <aside className="rounded-sheet border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="text-xl">Order summary</h2>
        <dl className="mt-5 space-y-3 text-[0.9375rem]">
          <div className="flex justify-between">
            <dt className="text-fg-muted">Subtotal</dt>
            <dd className="font-mono tabular">{formatMoney(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Delivery</dt>
            <dd className="font-mono tabular">{totals.freeShippingApplied ? "Free" : "At checkout"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
          <span className="font-medium">Estimated total</span>
          <span className="font-mono text-xl font-medium tabular">{formatMoney(totals.subtotal)}</span>
        </div>
        <Button asChild size="lg" className="mt-6 w-full" endIcon={<ArrowRight className="h-5 w-5" />}>
          <Link href="/checkout">Checkout</Link>
        </Button>
        {buyable.length < lines.length && (
          <p className="mt-3 text-sm text-danger">Sold-out items are left out of your total. Remove them to continue.</p>
        )}
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </aside>
    </div>
  );
}
