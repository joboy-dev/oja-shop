import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { OrderSummaryDTO } from "@/lib/types/order";
import { formatDate } from "@/lib/utils/date";
import { formatMoney } from "@/lib/utils/money";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }: { order: OrderSummaryDTO }) {
  return (
    <Link
      href={`/account/orders/${order.orderNumber}`}
      className="group flex items-center gap-4 rounded-card border border-border bg-surface p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/50 hover:shadow-soft active:scale-[0.995]"
    >
      <div className="flex shrink-0 -space-x-3">
        {order.thumbnails.slice(0, 3).map((url, i) => (
          <span key={url + i} className="relative h-14 w-12 overflow-hidden rounded-lg border-2 border-surface bg-surface-2">
            <Image src={url} alt="" fill sizes="48px" className="object-cover" />
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-mono text-[0.9375rem] font-semibold">{order.orderNumber}</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-fg-muted">
          {formatDate(order.placedAt)} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
        </p>
      </div>
      <p className="font-mono text-[0.9375rem] font-medium tabular">{formatMoney(order.total)}</p>
      <ChevronRight className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
