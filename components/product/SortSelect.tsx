"use client";

import { Select } from "@/components/ui/Select";
import { sortOptions, type SortOption } from "@/lib/config/shop";
import { useShopNav } from "./ShopNav";

export function SortSelect() {
  const { params, navigate } = useShopNav();
  const current = (params.get("sort") as SortOption) in sortOptions ? (params.get("sort") as SortOption) : "newest";
  return (
    <div className="flex items-center gap-2.5">
      <span id="sort-label" className="hidden text-sm text-fg-muted sm:block">
        Sort by
      </span>
      <Select
        aria-label="Sort products"
        className="h-10 w-48"
        value={current}
        onValueChange={(v) => navigate({ sort: v === "newest" ? undefined : v })}
        options={Object.entries(sortOptions).map(([value, label]) => ({ value, label }))}
      />
    </div>
  );
}
