"use client";

import * as RSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { controlBase, controlBorder } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
}

export function Select({
  options,
  placeholder = "Select…",
  id,
  invalid,
  className,
  "aria-describedby": describedBy,
  "aria-label": ariaLabel,
  ...root
}: SelectProps) {
  return (
    <RSelect.Root {...root}>
      <RSelect.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        className={cn(
          controlBase,
          controlBorder(invalid),
          "inline-flex h-11 items-center justify-between gap-2 text-left data-[placeholder]:text-fg-muted",
          className,
        )}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon>
          <ChevronDown className="h-4 w-4 text-fg-muted" aria-hidden="true" />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className="z-[70] origin-[var(--radix-select-content-transform-origin)] max-h-[min(20rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-card border border-border bg-surface shadow-overlay data-[state=open]:animate-[pop-in_160ms_var(--ease-snap)] data-[state=closed]:animate-[pop-out_100ms_ease-out]"
        >
          <RSelect.Viewport className="p-1.5">
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="relative flex min-h-10 cursor-pointer select-none items-center rounded-control py-2 pl-3 pr-9 text-[0.9375rem] outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-primary-soft data-[disabled]:opacity-40"
              >
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
                <RSelect.ItemIndicator className="absolute right-3">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
