"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Accessible name of the numeric field, e.g. "Quantity of Adire Eleko Throw". */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled,
  label = "Quantity",
  size = "md",
  className,
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(String(value));
  // Re-sync the typed draft when the value changes from outside (buttons, server clamp).
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    setDraft(String(value));
  }

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const next = Number.isNaN(parsed) ? value : clamp(parsed, min, max);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const btn =
    "grid shrink-0 place-items-center text-fg transition-[background-color,transform] duration-150 hover:bg-surface-2 active:scale-90 disabled:pointer-events-none disabled:opacity-40";
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-control border border-border-strong bg-surface",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn(btn, dim)}
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1, min, max))}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={disabled}
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          }
        }}
        className={cn(
          "w-10 bg-transparent text-center font-mono text-[0.9375rem] font-medium tabular focus-visible:outline-none",
          size === "sm" ? "h-9" : "h-11",
        )}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn(btn, dim)}
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1, min, max))}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {label}: {value}
      </span>
    </div>
  );
}
