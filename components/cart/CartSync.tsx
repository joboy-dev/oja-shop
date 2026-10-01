"use client";

import { useEffect } from "react";
import { useCartStore } from "./cart-store";

/** Mount once per layout. Loads the guest cart, or merges it into the saved cart after sign-in. */
export function CartSync({ authenticated }: { authenticated: boolean }) {
  const init = useCartStore((s) => s.init);
  useEffect(() => {
    void init(authenticated);
  }, [authenticated, init]);
  return null;
}
