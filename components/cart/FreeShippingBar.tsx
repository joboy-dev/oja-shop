import { Truck } from "lucide-react";
import { shopConfig } from "@/lib/config/shop";
import { formatMoney } from "@/lib/utils/money";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = shopConfig.freeShippingThreshold;
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min(subtotal / threshold, 1);
  const unlocked = remaining === 0 && subtotal > 0;

  return (
    <div className="rounded-card bg-primary-soft p-3.5">
      <p className="flex items-center gap-2 text-sm font-medium text-fg">
        <Truck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {unlocked ? (
          "You've unlocked free standard delivery"
        ) : (
          <span>
            Add <span className="font-mono tabular">{formatMoney(remaining)}</span> more for free standard delivery
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-snap"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
