"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface StepCardProps {
  index: number;
  title: string;
  state: "upcoming" | "active" | "done";
  /** One-line recap shown once the step is complete. */
  summary?: React.ReactNode;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function StepCard({ index, title, state, summary, onEdit, children }: StepCardProps) {
  return (
    <section
      aria-labelledby={`step-${index}`}
      className={cn(
        "rounded-sheet border bg-surface transition-[border-color,box-shadow,opacity] duration-300",
        state === "active" ? "border-primary/50 shadow-soft" : "border-border",
        state === "upcoming" && "opacity-55",
      )}
    >
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold",
              state === "done" ? "bg-success text-white" : "bg-surface-2 text-fg-muted",
              state === "active" && "bg-primary text-on-primary",
            )}
          >
            {state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : index}
          </span>
          <h2 id={`step-${index}`} className="text-lg">
            {title}
          </h2>
        </div>
        {state === "done" && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${title.toLowerCase()}`}>
            Edit
          </Button>
        )}
      </header>

      {state === "done" && summary && <div className="px-5 pb-5 pl-[3.75rem] text-[0.9375rem] text-fg-muted sm:px-6 sm:pl-[3.75rem]">{summary}</div>}

      {state === "active" && (
        <motion.div
          initial={{ opacity: 0, transform: "translateY(8px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 pb-6 sm:px-6"
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}
