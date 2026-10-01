"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { maxPurchasable } from "@/lib/cart/merge";
import type { CartLine } from "@/lib/types/cart";
import {
  addToCartAction,
  getCartAction,
  mergeGuestCartAction,
  removeFromCartAction,
  resolveGuestCartAction,
  setCartQuantityAction,
} from "@/server/actions/cart.actions";

/** Everything the store needs to know about a product to add it without a round trip. */
export interface AddableProduct {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  imageAlt: string;
  price: number;
  stock: number;
}

interface CartState {
  lines: CartLine[];
  isAuthenticated: boolean;
  ready: boolean;
  drawerOpen: boolean;
  /** Increments on every successful add so the badge can replay its bump animation. */
  bumpKey: number;

  init: (authenticated: boolean) => Promise<void>;
  add: (product: AddableProduct, quantity?: number) => Promise<boolean>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  reset: () => void;
  setDrawerOpen: (open: boolean) => void;
}

// Server calls run one at a time, in order, so rapid taps can't land out of sequence.
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T,>(fn: () => Promise<T>): Promise<T> => {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
};

let initializedFor: boolean | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      /** After a failed server call, trust the server over our optimistic guess. */
      const resync = async () => {
        const res = await getCartAction();
        if (res.ok) set({ lines: res.data });
      };

      return {
        lines: [],
        isAuthenticated: false,
        ready: false,
        drawerOpen: false,
        bumpKey: 0,

        init: async (authenticated) => {
          if (initializedFor === authenticated) return;
          initializedFor = authenticated;

          await useCartStore.persist.rehydrate();
          const guestItems = get().lines.map(({ productId, quantity }) => ({ productId, quantity }));

          try {
            if (authenticated) {
              const res = guestItems.length
                ? await mergeGuestCartAction({ items: guestItems })
                : await getCartAction();
              if (res.ok) {
                // Flip the flag only after the merge succeeds so a failure never wipes the guest cart.
                set({ lines: res.data, isAuthenticated: true });
                if (guestItems.length && res.data.length) toast.success("Your bag was saved to your account");
              } else {
                toast.error("We couldn't load your saved bag. Showing what's on this device.");
              }
            } else {
              set({ isAuthenticated: false });
              if (guestItems.length) {
                const res = await resolveGuestCartAction({ items: guestItems });
                if (res.ok) set({ lines: res.data });
              }
            }
          } catch {
            toast.error("Couldn't reach the shop. Check your connection.");
          } finally {
            set({ ready: true });
          }
        },

        add: async (product, quantity = 1) => {
          if (product.stock <= 0) {
            toast.error(`${product.name} is sold out.`);
            return false;
          }
          const cap = maxPurchasable(product.stock);
          const prev = get().lines;
          const existing = prev.find((l) => l.productId === product.id);
          if (existing && existing.quantity >= cap) {
            toast(`You already have all ${cap} of ${product.name} in your bag.`);
            return false;
          }
          const nextQty = Math.min((existing?.quantity ?? 0) + quantity, cap);

          const optimistic: CartLine[] = existing
            ? prev.map((l) => (l.productId === product.id ? { ...l, quantity: nextQty } : l))
            : [
                ...prev,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  imageAlt: product.imageAlt,
                  unitPrice: product.price,
                  quantity: nextQty,
                  stock: product.stock,
                  available: true,
                },
              ];
          set({ lines: optimistic, bumpKey: get().bumpKey + 1 });

          if (!get().isAuthenticated) return true;
          const res = await enqueue(() => addToCartAction({ productId: product.id, quantity }));
          if (!res.ok) {
            toast.error(res.error);
            await resync();
            return false;
          }
          set({ lines: res.data });
          return true;
        },

        setQuantity: async (productId, quantity) => {
          if (quantity <= 0) return get().remove(productId);
          const line = get().lines.find((l) => l.productId === productId);
          if (!line) return;
          const next = Math.min(quantity, maxPurchasable(line.stock));
          set({ lines: get().lines.map((l) => (l.productId === productId ? { ...l, quantity: next } : l)) });

          if (!get().isAuthenticated) return;
          const res = await enqueue(() => setCartQuantityAction({ productId, quantity: next }));
          if (!res.ok) {
            toast.error(res.error);
            await resync();
          } else {
            set({ lines: res.data });
          }
        },

        remove: async (productId) => {
          const removed = get().lines.find((l) => l.productId === productId);
          if (!removed) return;
          set({ lines: get().lines.filter((l) => l.productId !== productId) });

          toast(`Removed ${removed.name}`, {
            action: {
              label: "Undo",
              onClick: () =>
                void get().add(
                  {
                    id: removed.productId,
                    slug: removed.slug,
                    name: removed.name,
                    imageUrl: removed.imageUrl,
                    imageAlt: removed.imageAlt,
                    price: removed.unitPrice,
                    stock: removed.stock,
                  },
                  removed.quantity,
                ),
            },
          });

          if (!get().isAuthenticated) return;
          const res = await enqueue(() => removeFromCartAction({ productId }));
          if (!res.ok) {
            toast.error(res.error);
            await resync();
          } else {
            set({ lines: res.data });
          }
        },

        /** Called on sign-out so the previous user's bag doesn't become a guest bag. */
        reset: () => {
          initializedFor = null;
          set({ lines: [], isAuthenticated: false, ready: false, drawerOpen: false });
        },

        setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
      };
    },
    {
      name: "oja-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrated in init() so server and first client render match
      // The saved cart lives in the database for signed-in users; only guests persist locally.
      partialize: (state) => ({ lines: state.isAuthenticated ? [] : state.lines }),
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => (l.available ? n + l.quantity : n), 0);
export const selectSubtotal = (s: CartState) =>
  s.lines.reduce((sum, l) => (l.available ? sum + l.unitPrice * l.quantity : sum), 0);
