import type { LucideIcon } from "lucide-react";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate flex flex-col items-center overflow-hidden rounded-sheet border border-dashed border-border-strong px-6 py-14 text-center",
        className,
      )}
    >
      <AdirePattern className="absolute inset-0 -z-10 text-primary opacity-[0.05]" />
      {Icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h2 className="text-xl">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
