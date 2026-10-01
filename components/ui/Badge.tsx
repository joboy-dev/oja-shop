import { cn } from "@/lib/utils/cn";

const tones = {
  neutral: "bg-surface-2 text-fg",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent text-on-accent",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  outline: "border border-border-strong text-fg-muted",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
