"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useTransition } from "react";
import { cn } from "@/lib/utils/cn";

type Updates = Record<string, string | undefined>;

interface ShopNavValue {
  params: URLSearchParams;
  isPending: boolean;
  /** Merge changes into the query string (unset a key with undefined) and reset to page 1. */
  navigate: (updates: Updates) => void;
}

const ShopNavContext = createContext<ShopNavValue | null>(null);

/** Keeps filters in the URL (shareable, back button works) and exposes a pending flag while results reload. */
export function ShopNavProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      const qs = next.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  const value = useMemo(
    () => ({ params: new URLSearchParams(searchParams.toString()), isPending, navigate }),
    [searchParams, isPending, navigate],
  );
  return <ShopNavContext.Provider value={value}>{children}</ShopNavContext.Provider>;
}

export function useShopNav() {
  const ctx = useContext(ShopNavContext);
  if (!ctx) throw new Error("useShopNav must be used inside <ShopNavProvider>");
  return ctx;
}

/** Dims the results while a new filter is loading. */
export function ResultsFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isPending } = useShopNav();
  return (
    <div aria-busy={isPending} className={cn("transition-opacity duration-200", isPending && "opacity-50", className)}>
      {children}
    </div>
  );
}
