import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <Skeleton className="mb-5 h-8 w-48" />
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-card" />)}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-card" />
        <Skeleton className="h-40 rounded-card" />
      </div>
    </div>
  );
}
