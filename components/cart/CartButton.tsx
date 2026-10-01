"use client";

import { ShoppingBag } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import { selectCount, useCartStore } from "./cart-store";

export function CartButton() {
  const count = useCartStore(selectCount);
  const bumpKey = useCartStore((s) => s.bumpKey);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  return (
    <IconButton
      label={count > 0 ? `Open bag, ${count} ${count === 1 ? "item" : "items"}` : "Open bag"}
      onClick={() => setDrawerOpen(true)}
      className="relative"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {count > 0 && (
        <span
          key={bumpKey}
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 grid h-[1.125rem] min-w-[1.125rem] animate-[bump_320ms_var(--ease-snap)] place-items-center rounded-full bg-accent px-1 font-mono text-[0.6875rem] font-bold leading-none text-on-accent"
        >
          {count}
        </span>
      )}
    </IconButton>
  );
}
