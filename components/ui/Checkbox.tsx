"use client";

import * as RCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps extends Omit<RCheckbox.CheckboxProps, "children"> {
  label: React.ReactNode;
  description?: string;
}

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const autoId = useId();
  const cid = id ?? autoId;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RCheckbox.Root
        id={cid}
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-border-strong bg-surface transition-[background-color,border-color,transform] duration-150 active:scale-90 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        {...props}
      >
        <RCheckbox.Indicator>
          <Check className="h-3.5 w-3.5 text-on-primary" strokeWidth={3} aria-hidden="true" />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      <label htmlFor={cid} className="cursor-pointer text-[0.9375rem] leading-snug">
        <span className="font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-fg-muted">{description}</span>}
      </label>
    </div>
  );
}
