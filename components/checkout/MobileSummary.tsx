"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { selectSubtotal, useCartStore } from "@/components/cart/cart-store";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import type { ShippingMethodId } from "@/lib/config/shop";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";
import { OrderSummary } from "./OrderSummary";

/** Phones: a collapsed "Show order summary · ₦48,500" bar above the form. */
export function MobileSummary({ shippingMethod }: { shippingMethod: ShippingMethodId }) {
  const [open, setOpen] = useState(false);
  const lines = useCartStore((s) => s.lines).filter((l) => l.available);
  useCartStore(selectSubtotal);
  const total = calculateTotals(lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })), shippingMethod).total;

  return (
    <div className="-mx-4 border-y border-border bg-surface sm:-mx-6 lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="container-page flex min-h-14 w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-primary">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {open ? "Hide" : "Show"} order summary
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
        </span>
        <span className="font-mono text-lg font-medium tabular">{formatMoney(total)}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="container-page pb-5 pt-1">
              <OrderSummary shippingMethod={shippingMethod} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
