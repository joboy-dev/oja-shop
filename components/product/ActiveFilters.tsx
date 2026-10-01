"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { sortOptions } from "@/lib/config/shop";
import { useShopNav } from "./ShopNav";

export function ActiveFilters() {
  const { params, navigate } = useShopNav();
  const chips: { key: string; label: string; clear: () => void }[] = [];

  const q = params.get("q");
  if (q) chips.push({ key: "q", label: `“${q}”`, clear: () => navigate({ q: undefined }) });

  const min = params.get("min");
  const max = params.get("max");
  if (min || max) {
    const label = min && max ? `₦${min} – ₦${max}` : min ? `From ₦${min}` : `Up to ₦${max}`;
    chips.push({ key: "price", label, clear: () => navigate({ min: undefined, max: undefined }) });
  }
  if (params.get("stock") === "1") chips.push({ key: "stock", label: "In stock", clear: () => navigate({ stock: undefined }) });
  const sort = params.get("sort");
  if (sort && sort in sortOptions && sort !== "newest")
    chips.push({ key: "sort", label: sortOptions[sort as keyof typeof sortOptions], clear: () => navigate({ sort: undefined }) });

  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((c) => (
          <motion.li
            key={c.key}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          >
            <button
              type="button"
              onClick={c.clear}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary-soft py-1 pl-3.5 pr-2.5 text-sm font-medium text-primary transition-transform duration-150 active:scale-95"
            >
              {c.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Remove filter</span>
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
      <li>
        <button
          type="button"
          onClick={() => navigate({ q: undefined, min: undefined, max: undefined, stock: undefined, sort: undefined })}
          className="min-h-9 px-2 text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
