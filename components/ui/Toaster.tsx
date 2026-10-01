"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/lib/hooks/useTheme";

export function Toaster() {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      closeButton
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-card !border !border-border !bg-surface !text-fg !shadow-lift !font-sans !text-[0.9375rem]",
          description: "!text-fg-muted",
          actionButton: "!rounded-lg !bg-primary !text-on-primary",
          cancelButton: "!rounded-lg !bg-surface-2 !text-fg",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-danger",
        },
      }}
    />
  );
}
