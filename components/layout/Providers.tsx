"use client";

import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/Toaster";
import { TooltipProvider } from "@/components/ui/Tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={250} skipDelayDuration={400}>
        {children}
        <Toaster />
      </TooltipProvider>
    </MotionConfig>
  );
}
