"use client";

import * as RTooltip from "@radix-ui/react-tooltip";

export const TooltipProvider = RTooltip.Provider;

export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={8}
          className="z-[80] origin-[var(--radix-tooltip-content-transform-origin)] rounded-lg bg-fg px-2.5 py-1.5 text-xs font-medium text-background shadow-lift data-[state=delayed-open]:animate-[pop-in_140ms_var(--ease-snap)]"
        >
          {content}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}
