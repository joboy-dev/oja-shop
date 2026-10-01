"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCartStore } from "./cart-store";

const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });

/**
 * The drawer (and the sheet library behind it) only matters once someone opens the bag,
 * so it's loaded on first open, and quietly warmed up a few seconds after the page settles.
 */
export function LazyCartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const [wanted, setWanted] = useState(false);
  if (open && !wanted) setWanted(true);

  useEffect(() => {
    const t = setTimeout(() => setWanted(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return wanted ? <CartDrawer /> : null;
}
