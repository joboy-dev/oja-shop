"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { useCartStore, type AddableProduct } from "@/components/cart/cart-store";

const swap = { initial: { scale: 0.4, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.4, opacity: 0 } };

export function AddToBagButton({
  product,
  quantity = 1,
  openDrawer = true,
  ...props
}: { product: AddableProduct; quantity?: number; openDrawer?: boolean } & Omit<ButtonProps, "onClick" | "children">) {
  const add = useCartStore((s) => s.add);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  async function onClick() {
    const ok = await add(product, quantity);
    if (!ok) return;
    setAdded(true);
    if (openDrawer) setDrawerOpen(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button
      size="lg"
      disabled={soldOut}
      onClick={onClick}
      variant={added ? "secondary" : "primary"}
      endIcon={
        <span className="relative grid h-5 w-5 place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "check" : "bag"}
              {...swap}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              className="absolute"
            >
              {added ? <Check className="h-5 w-5 text-success" aria-hidden="true" /> : <ShoppingBag className="h-5 w-5" aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
        </span>
      }
      {...props}
    >
      {soldOut ? "Sold out" : added ? "Added to bag" : "Add to bag"}
    </Button>
  );
}
