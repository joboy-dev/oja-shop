"use client";

import { X } from "lucide-react";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";
import { IconButton } from "./Button";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** `responsive`: slides in from the right on desktop, rises from the bottom on phones (drag to dismiss). */
  side?: "responsive" | "right" | "left" | "bottom";
  children: React.ReactNode;
  /** Pinned to the bottom of the sheet, outside the scroll area. */
  footer?: React.ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  side = "responsive",
  children,
  footer,
  className,
}: SheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const direction = side === "responsive" ? (isDesktop ? "right" : "bottom") : side;
  const isBottom = direction === "bottom";

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={direction} shouldScaleBackground={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]" />
        <Drawer.Content
          className={cn(
            "fixed z-50 flex flex-col bg-surface shadow-overlay outline-none",
            isBottom && "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-sheet border-t border-border",
            direction === "right" && "inset-y-0 right-0 w-full max-w-md border-l border-border",
            direction === "left" && "inset-y-0 left-0 w-full max-w-md border-r border-border",
            className,
          )}
        >
          {isBottom && <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border-strong" />}
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
            <div className="min-w-0">
              <Drawer.Title className="font-display text-xl font-semibold tracking-tight">{title}</Drawer.Title>
              {description ? (
                <Drawer.Description className="mt-0.5 text-sm text-fg-muted">{description}</Drawer.Description>
              ) : (
                <Drawer.Description className="sr-only">{title}</Drawer.Description>
              )}
            </div>
            <Drawer.Close asChild>
              <IconButton label="Close" className="-mr-2 shrink-0">
                <X className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </Drawer.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
          {footer && <div className="shrink-0 border-t border-border bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
