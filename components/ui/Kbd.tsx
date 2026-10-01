import { cn } from "@/lib/utils/cn";

export function Kbd({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border-strong bg-surface-2 px-1.5 font-mono text-[0.6875rem] font-medium text-fg-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
