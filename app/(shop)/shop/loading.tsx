import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-page pb-8 pt-8" aria-busy="true">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="mb-3 mt-6 h-12 w-72 max-w-full" />
      <Skeleton className="mb-10 h-5 w-96 max-w-full" />
      <div className="grid gap-10 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
        <ProductGridSkeleton count={9} columns={3} />
      </div>
    </div>
  );
}
