"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { maxPurchasable } from "@/lib/cart/merge";
import type { CartLine } from "@/lib/types/cart";
import { formatMoney } from "@/lib/utils/money";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "./cart-store";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={`/products/${line.slug}`}
        onClick={onNavigate}
        className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-card bg-surface-2"
      >
        {line.imageUrl && (
          <Image src={line.imageUrl} alt={line.imageAlt} fill sizes="88px" className="object-cover" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${line.slug}`}
            onClick={onNavigate}
            className="line-clamp-2 font-medium leading-snug hover:text-primary"
          >
            {line.name}
          </Link>
          <IconButton
            label={`Remove ${line.name}`}
            variant="ghost"
            className="-mr-2 -mt-1.5 h-9 w-9 shrink-0 text-fg-muted hover:text-danger"
            onClick={() => void remove(line.productId)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>

        <p className="mt-0.5 font-mono text-sm tabular text-fg-muted">{formatMoney(line.unitPrice)}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {line.available ? (
            <QuantityStepper
              size="sm"
              value={line.quantity}
              max={maxPurchasable(line.stock)}
              label={`Quantity of ${line.name}`}
              onChange={(q) => void setQuantity(line.productId, q)}
            />
          ) : (
            <Badge tone="danger">Sold out</Badge>
          )}
          <p className="font-mono text-[0.9375rem] font-medium tabular">
            {line.available ? formatMoney(line.unitPrice * line.quantity) : "—"}
          </p>
        </div>

        {line.available && line.stock <= 5 && (
          <p className="mt-2 text-xs font-medium text-danger">Only {line.stock} left</p>
        )}
      </div>
    </li>
  );
}
