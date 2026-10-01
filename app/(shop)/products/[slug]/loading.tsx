import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-page pb-8 pt-8" aria-busy="true">
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Skeleton className="aspect-[4/5] w-full rounded-sheet" />
        <div className="space-y-5 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
