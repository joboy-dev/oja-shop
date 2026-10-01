import Image from "next/image";
import Link from "next/link";
import type { OrderItemDTO } from "@/lib/types/order";
import { formatMoney } from "@/lib/utils/money";

export function OrderItemsList({ items }: { items: OrderItemDTO[] }) {
  return (
    <ul className="divide-y divide-border">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
            {i.imageUrl && <Image src={i.imageUrl} alt="" fill sizes="64px" className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${i.slug}`} className="font-medium leading-snug hover:text-primary">
              {i.name}
            </Link>
            <p className="mt-0.5 text-sm text-fg-muted">
              <span className="font-mono tabular">{formatMoney(i.unitPrice)}</span> × {i.quantity}
            </p>
          </div>
          <p className="font-mono text-[0.9375rem] font-medium tabular">{formatMoney(i.lineTotal)}</p>
        </li>
      ))}
    </ul>
  );
}
