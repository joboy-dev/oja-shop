import { cn } from "@/lib/utils/cn";

/** Placeholder with the same dimensions as the content it stands in for (no layout shift). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("skeleton rounded-control", className)} {...props} />;
}
