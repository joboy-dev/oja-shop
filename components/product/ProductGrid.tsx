import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductSummary } from "@/lib/types/catalog";
import { cn } from "@/lib/utils/cn";
import { ProductCard } from "./ProductCard";

const grid = "grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:gap-x-6";

export function ProductGrid({
  products,
  wishedIds = [],
  authenticated = false,
  columns = 4,
  priorityCount = 0,
  headingLevel = 3,
  className,
}: {
  products: ProductSummary[];
  wishedIds?: string[];
  authenticated?: boolean;
  columns?: 3 | 4;
  /** How many leading cards are above the fold and should load at high priority (LCP). Default none. */
  priorityCount?: number;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const wished = new Set(wishedIds);
  return (
    <div className={cn(grid, columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} wished={wished.has(p.id)} authenticated={authenticated} priority={i < priorityCount} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-card" />
      <Skeleton className="mt-3.5 h-3 w-1/3" />
      <Skeleton className="mt-2.5 h-4 w-4/5" />
      <Skeleton className="mt-2.5 h-4 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 3 | 4 }) {
  return (
    <div className={cn(grid, columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
