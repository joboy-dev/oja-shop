"use client";

import * as RDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { IconButton } from "./Button";

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

interface DialogContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Hide the visual title (it is still announced to screen readers). */
  hideTitle?: boolean;
}

export function DialogContent({ title, description, children, className, hideTitle }: DialogContentProps) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px] data-[state=open]:animate-[fade-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_120ms_ease-out]" />
      <RDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sheet border border-border bg-surface p-6 shadow-overlay",
          "data-[state=open]:animate-[dialog-in_200ms_var(--ease-snap)] data-[state=closed]:animate-[dialog-out_140ms_ease-out]",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className={cn(hideTitle && "sr-only")}>
            <RDialog.Title className="font-display text-xl font-semibold tracking-tight">{title}</RDialog.Title>
            {description ? (
              <RDialog.Description className="mt-1 text-sm text-fg-muted">{description}</RDialog.Description>
            ) : (
              <RDialog.Description className="sr-only">{title}</RDialog.Description>
            )}
          </div>
          <RDialog.Close asChild>
            <IconButton label="Close" className="-mr-2 -mt-2 shrink-0">
              <X className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </RDialog.Close>
        </div>
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}
