"use client";

import { useEffect, useRef, useState } from "react";
import type { AddableProduct } from "@/components/cart/cart-store";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { maxPurchasable } from "@/lib/cart/merge";
import { cn } from "@/lib/utils/cn";
import { AddToBagButton } from "./AddToBagButton";
import { WishlistButton } from "./WishlistButton";

/** Quantity, add-to-bag and wishlist, plus a bar that pins to the bottom on phones once the main button scrolls away. */
export function ProductPurchase({
  product,
  compareAt,
  wished,
  authenticated,
}: {
  product: AddableProduct;
  compareAt: number | null;
  wished: boolean;
  authenticated: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const anchor = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const max = maxPurchasable(product.stock);
  const soldOut = max === 0;

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    // Show the sticky bar only after the main button has scrolled out of view *upwards*.
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={anchor} className="flex flex-wrap items-center gap-3">
        {!soldOut && (
          <QuantityStepper value={quantity} onChange={setQuantity} max={max} label={`Quantity of ${product.name}`} />
        )}
        <AddToBagButton product={product} quantity={quantity} className="min-w-44 flex-1" />
        <WishlistButton
          productId={product.id}
          productName={product.name}
          wished={wished}
          authenticated={authenticated}
          className="border border-border-strong"
        />
      </div>

      <div
        aria-hidden={!stuck}
        className={cn(
          "glass fixed inset-x-0 bottom-0 z-30 border-t border-border px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-snap md:hidden",
          stuck ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <Price kobo={product.price} compareAt={compareAt} size="sm" />
          </div>
          <AddToBagButton product={product} quantity={quantity} tabIndex={stuck ? 0 : -1} />
        </div>
      </div>
    </>
  );
}
