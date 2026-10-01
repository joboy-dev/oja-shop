"use client";

import * as RTabs from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

/** Tabs with a sliding underline. Respects reduced motion via the global media query. */
export function Tabs({ tabs, defaultValue, className }: { tabs: TabItem[]; defaultValue?: string; className?: string }) {
  const [value, setValue] = useState(defaultValue ?? tabs[0]?.value);
  const groupId = useId();

  return (
    <RTabs.Root value={value} onValueChange={setValue} className={className}>
      <RTabs.List className="hide-scrollbar relative -mx-1 flex gap-1 overflow-x-auto border-b border-border px-1">
        {tabs.map((t) => (
          <RTabs.Trigger
            key={t.value}
            value={t.value}
            className={cn(
              "relative min-h-11 shrink-0 px-3.5 py-2.5 text-[0.9375rem] font-medium text-fg-muted transition-colors duration-150",
              "hover:text-fg data-[state=active]:text-fg",
            )}
          >
            {t.label}
            {value === t.value && (
              <motion.span
                layoutId={`tab-underline-${groupId}`}
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              />
            )}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      {tabs.map((t) => (
        <RTabs.Content
          key={t.value}
          value={t.value}
          className="pt-5 outline-none data-[state=active]:animate-[fade-in_200ms_ease-out]"
        >
          {t.content}
        </RTabs.Content>
      ))}
    </RTabs.Root>
  );
}
