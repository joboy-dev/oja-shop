import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = ["Contact", "Address", "Delivery", "Review"] as const;

/** Four real, ordered steps, so numbering carries information here. */
export function CheckoutProgress({ step }: { step: number }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")} aria-current={current ? "step" : undefined}>
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition-colors duration-300",
                    done && "border-primary bg-primary text-on-primary",
                    current && "border-primary text-primary",
                    !done && !current && "border-border-strong text-fg-muted",
                  )}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : n}
                </span>
                <span className={cn("hidden text-sm font-medium sm:block", current ? "text-fg" : "text-fg-muted")}>{label}</span>
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <span className={cn("block h-full origin-left bg-primary transition-transform duration-500 ease-snap", done ? "scale-x-100" : "scale-x-0")} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm text-fg-muted sm:hidden" aria-hidden="true">
        Step {step} of {steps.length}: {steps[step - 1]}
      </p>
    </nav>
  );
}
