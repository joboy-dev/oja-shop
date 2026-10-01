import { Check, X } from "lucide-react";
import { orderStatusLabels, type OrderStatus } from "@/lib/config/shop";
import type { OrderEventDTO } from "@/lib/types/order";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/date";

const flow: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered"];

/** Where the order is now, with the time each step happened. */
export function OrderStatusTimeline({ status, events }: { status: OrderStatus; events: OrderEventDTO[] }) {
  const at = new Map<OrderStatus, OrderEventDTO>();
  for (const e of events) if (!at.has(e.status)) at.set(e.status, e);

  if (status === "cancelled") {
    const e = at.get("cancelled");
    return (
      <div className="flex items-start gap-3 rounded-card bg-danger-soft p-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-danger text-white">
          <X className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium text-danger">Order cancelled</p>
          {e && <p className="text-sm text-fg-muted">{formatDateTime(e.createdAt)}</p>}
          {e?.note && <p className="mt-1 text-sm">{e.note}</p>}
        </div>
      </div>
    );
  }

  const currentIndex = flow.indexOf(status === "pending" ? "confirmed" : status);
  return (
    <ol className="relative space-y-5">
      {flow.map((s, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;
        const event = at.get(s);
        return (
          <li key={s} className="relative flex gap-4" aria-current={current ? "step" : undefined}>
            {i < flow.length - 1 && (
              <span aria-hidden="true" className={cn("absolute left-[0.8125rem] top-8 h-[calc(100%-0.5rem)] w-0.5", i < currentIndex ? "bg-primary" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2",
                reached ? "border-primary bg-primary text-on-primary" : "border-border-strong bg-surface text-transparent",
                current && "ring-4 ring-primary/20",
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            <div className="-mt-0.5 pb-1">
              <p className={cn("font-medium", !reached && "text-fg-muted")}>{orderStatusLabels[s]}</p>
              {event ? (
                <p className="text-sm text-fg-muted">
                  {formatDateTime(event.createdAt)}
                  {event.note && event.note !== "Order placed" ? ` · ${event.note}` : ""}
                </p>
              ) : (
                <p className="text-sm text-fg-muted/70">{reached ? "" : "Not yet"}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
