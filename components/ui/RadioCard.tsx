"use client";

import * as RRadio from "@radix-ui/react-radio-group";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

export function RadioCardGroup({ className, ...props }: RRadio.RadioGroupProps) {
  return <RRadio.Root className={cn("grid gap-3", className)} {...props} />;
}

interface RadioCardProps {
  value: string;
  title: string;
  description?: string;
  /** Right-aligned text, typically a price. */
  aside?: React.ReactNode;
  disabled?: boolean;
}

/** A whole-card radio option, used for addresses, delivery and payment choices. */
export function RadioCard({ value, title, description, aside, disabled }: RadioCardProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-card border border-border-strong bg-surface p-4",
        "transition-[border-color,background-color,box-shadow,transform] duration-150 active:scale-[0.99]",
        "hover:border-primary/60 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <RRadio.Item
        id={id}
        value={value}
        disabled={disabled}
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-border-strong bg-surface data-[state=checked]:border-primary"
      >
        <RRadio.Indicator className="h-2.5 w-2.5 rounded-full bg-primary" />
      </RRadio.Item>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-fg-muted">{description}</span>}
      </span>
      {aside && <span className="shrink-0 font-mono text-sm font-medium tabular">{aside}</span>}
    </label>
  );
}
