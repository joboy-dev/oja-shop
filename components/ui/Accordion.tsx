"use client";

import * as RAccordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AccordionEntry {
  value: string;
  title: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  defaultValue,
  className,
}: {
  items: AccordionEntry[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <RAccordion.Root type="single" collapsible defaultValue={defaultValue} className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <RAccordion.Item key={item.value} value={item.value} id={item.value}>
          <RAccordion.Header asChild>
            <h2>
            <RAccordion.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left font-display text-lg font-semibold tracking-tight">
              {item.title}
              <Plus
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 ease-snap group-data-[state=open]:rotate-45"
              />
            </RAccordion.Trigger>
            </h2>
          </RAccordion.Header>
          <RAccordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_220ms_var(--ease-snap)] data-[state=closed]:animate-[accordion-up_180ms_ease-out]">
            <div className="pb-5 pr-9 text-fg-muted">{item.content}</div>
          </RAccordion.Content>
        </RAccordion.Item>
      ))}
    </RAccordion.Root>
  );
}
