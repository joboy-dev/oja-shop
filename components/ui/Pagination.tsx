import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

function pageWindow(page: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push("…");
    out.push(p);
  });
  return out;
}

/** URL-driven pagination: every page is a real link, so back/forward and sharing just work. */
export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const item =
    "inline-grid h-11 min-w-11 place-items-center rounded-control px-3 text-[0.9375rem] font-medium transition-[background-color,transform] duration-150 active:scale-95";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} aria-label="Previous page" className={cn(item, "hover:bg-surface-2")}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(item, "opacity-30")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}
      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-fg-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(item, "tabular", p === page ? "bg-primary text-on-primary" : "hover:bg-surface-2")}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} aria-label="Next page" className={cn(item, "hover:bg-surface-2")}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(item, "opacity-30")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
