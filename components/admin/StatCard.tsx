import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  href?: string;
  tone?: "default" | "warn" | "danger";
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg-muted">{label}</p>
        {Icon && (
          <span className={cn("grid h-9 w-9 place-items-center rounded-full", tone === "default" && "bg-primary-soft text-primary", tone === "warn" && "bg-accent/25 text-fg", tone === "danger" && "bg-danger-soft text-danger")}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-2xl font-medium tabular sm:text-[1.75rem]">{value}</p>
      {hint && <p className="mt-1 text-sm text-fg-muted">{hint}</p>}
    </>
  );
  const cls = "block rounded-card border border-border bg-surface p-5";
  return href ? (
    <Link href={href} className={cn(cls, "transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/50 hover:shadow-soft active:scale-[0.99]")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
