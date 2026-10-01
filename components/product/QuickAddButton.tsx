"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCartStore, type AddableProduct } from "@/components/cart/cart-store";
import { cn } from "@/lib/utils/cn";

/** Small "+" on a product card. Visible on touch screens; fades in on hover for pointer devices. */
export function QuickAddButton({ product, className }: { product: AddableProduct; className?: string }) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ok = await add(product);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${product.name} to bag`}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary shadow-lift transition-[transform,opacity,background-color] duration-200 ease-snap",
        "active:scale-90 focus-visible:opacity-100",
        "[@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100",
        added && "bg-success text-white",
        className,
      )}
    >
      {added ? <Check className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
