"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { formatMoney } from "@/lib/utils/money";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingBar } from "./FreeShippingBar";
import { selectCount, selectSubtotal, useCartStore } from "./cart-store";

export function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const setOpen = useCartStore((s) => s.setDrawerOpen);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);
  const close = () => setOpen(false);
  const hasBuyable = lines.some((l) => l.available);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="Your bag"
      description={count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : undefined}
      footer={
        lines.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-fg-muted">Subtotal</span>
              <span className="font-mono text-lg font-medium tabular">{formatMoney(subtotal)}</span>
            </div>
            <p className="text-xs text-fg-muted">Delivery and payment are chosen at checkout.</p>
            <Button asChild size="lg" className="w-full" aria-disabled={!hasBuyable}>
              <Link href="/checkout" onClick={close}>
                Checkout
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/cart" onClick={close}>
                View full bag
              </Link>
            </Button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="font-display text-lg font-semibold">Your bag is empty</p>
          <p className="mt-1 max-w-56 text-sm text-fg-muted">Start with something new from the shop.</p>
          <Button asChild className="mt-5">
            <Link href="/shop" onClick={close}>
              Browse the shop
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2 pt-1">
          <FreeShippingBar subtotal={subtotal} />
          <ul className="divide-y divide-border">
            {lines.map((line) => (
              <CartLineItem key={line.productId} line={line} onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
