"use client";

import { useScrollDirection } from "@/lib/hooks/useScrollDirection";
import { cn } from "@/lib/utils/cn";

/** Sticky translucent bar that slides away while scrolling down and returns on scroll up. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const direction = useScrollDirection(120);
  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 border-b border-border/70 transition-transform duration-300 ease-snap",
        direction === "down" && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
