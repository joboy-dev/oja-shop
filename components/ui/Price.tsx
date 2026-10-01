import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";

const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl", xl: "text-3xl" } as const;

export function Price({
  kobo,
  compareAt,
  size = "md",
  className,
}: {
  kobo: number;
  compareAt?: number | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const onSale = compareAt != null && compareAt > kobo;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", sizes[size], className)}>
      <span className={cn("font-mono font-medium tabular", onSale && "text-fg")}>{formatMoney(kobo)}</span>
      {onSale && (
        <>
          <s className="font-mono text-[0.85em] tabular text-fg-muted">
            <span className="sr-only">Was </span>
            {formatMoney(compareAt)}
          </s>
        </>
      )}
    </span>
  );
}

export function discountPercent(kobo: number, compareAt?: number | null) {
  return compareAt && compareAt > kobo ? Math.round((1 - kobo / compareAt) * 100) : 0;
}
