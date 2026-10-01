import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mb-8 mt-3 h-5 w-80 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-32 rounded-card" />)}
      </div>
      <Skeleton className="mt-8 h-72 rounded-card" />
    </div>
  );
}
