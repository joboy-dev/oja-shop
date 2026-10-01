"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import type { CategoryDTO } from "@/lib/types/catalog";
import { FilterPanel } from "./FilterPanel";
import { useShopNav } from "./ShopNav";

/** Phone/tablet filters: the same panel in a bottom sheet. Changes apply instantly. */
export function FilterSheet({ categories, activeCategory, total }: { categories: CategoryDTO[]; activeCategory?: string; total: number }) {
  const [open, setOpen] = useState(false);
  const { params } = useShopNav();
  const count = ["q", "min", "max", "stock"].filter((k) => params.get(k)).length;

  return (
    <>
      <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setOpen(true)} startIcon={<SlidersHorizontal className="h-4 w-4" />}>
        Filters{count > 0 && <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-on-primary">{count}</span>}
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        title="Filters"
        footer={
          <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
            Show {total} {total === 1 ? "product" : "products"}
          </Button>
        }
      >
        <div className="pt-2">
          <FilterPanel categories={categories} activeCategory={activeCategory} />
        </div>
      </Sheet>
    </>
  );
}
