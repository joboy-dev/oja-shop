"use client";

import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import type { CategoryDTO } from "@/lib/types/catalog";
import { cn } from "@/lib/utils/cn";
import { useShopNav } from "./ShopNav";

const pricePresets = [
  { label: "Under ₦10k", min: undefined, max: "10000" },
  { label: "₦10k – ₦25k", min: "10000", max: "25000" },
  { label: "₦25k+", min: "25000", max: undefined },
] as const;

export function FilterPanel({ categories, activeCategory }: { categories: CategoryDTO[]; activeCategory?: string }) {
  const { params, navigate } = useShopNav();
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const [minDraft, setMinDraft] = useState(min);
  const [maxDraft, setMaxDraft] = useState(max);

  // Keep the inputs in sync when chips elsewhere change the URL.
  const [seen, setSeen] = useState({ min, max });
  if (seen.min !== min || seen.max !== max) {
    setSeen({ min, max });
    setMinDraft(min);
    setMaxDraft(max);
  }

  const keep = new URLSearchParams(params);
  keep.delete("page");
  const qs = keep.toString() ? `?${keep.toString()}` : "";

  const applyPrice = () => navigate({ min: minDraft.trim() || undefined, max: maxDraft.trim() || undefined });
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyPrice();
    }
  };

  const catLink = (active: boolean) =>
    cn(
      "flex min-h-10 items-center justify-between rounded-control px-3 text-[0.9375rem] transition-colors duration-150",
      active ? "bg-primary-soft font-medium text-primary" : "hover:bg-surface-2",
    );

  return (
    <div className="space-y-8">
      <section aria-labelledby="f-cat">
        <h2 id="f-cat" className="eyebrow mb-3">
          Category
        </h2>
        <ul className="-mx-3 space-y-0.5">
          <li>
            <Link href={`/shop${qs}`} className={catLink(!activeCategory)} aria-current={!activeCategory ? "page" : undefined}>
              All products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/shop/${c.slug}${qs}`}
                className={catLink(activeCategory === c.slug)}
                aria-current={activeCategory === c.slug ? "page" : undefined}
              >
                {c.name}
                <span className="font-mono text-sm tabular text-fg-muted">{c.productCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="f-price">
        <h2 id="f-price" className="eyebrow mb-3">
          Price (₦)
        </h2>
        <div className="flex items-center gap-2">
          <Input
            aria-label="Minimum price in naira"
            inputMode="numeric"
            placeholder="Min"
            value={minDraft}
            onChange={(e) => setMinDraft(e.target.value.replace(/[^\d,]/g, ""))}
            onBlur={applyPrice}
            onKeyDown={onEnter}
          />
          <span aria-hidden="true" className="text-fg-muted">
            –
          </span>
          <Input
            aria-label="Maximum price in naira"
            inputMode="numeric"
            placeholder="Max"
            value={maxDraft}
            onChange={(e) => setMaxDraft(e.target.value.replace(/[^\d,]/g, ""))}
            onBlur={applyPrice}
            onKeyDown={onEnter}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {pricePresets.map((p) => {
            const active = (p.min ?? "") === min && (p.max ?? "") === max;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => (active ? navigate({ min: undefined, max: undefined }) : navigate({ min: p.min, max: p.max }))}
                className={cn(
                  "min-h-9 rounded-full border px-3.5 text-sm transition-[background-color,border-color,transform] duration-150 active:scale-95",
                  active ? "border-primary bg-primary-soft font-medium text-primary" : "border-border-strong hover:border-primary/60",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="f-avail">
        <h2 id="f-avail" className="eyebrow mb-3">
          Availability
        </h2>
        <Checkbox
          label="In stock only"
          checked={params.get("stock") === "1"}
          onCheckedChange={(c) => navigate({ stock: c === true ? "1" : undefined })}
        />
      </section>
    </div>
  );
}
