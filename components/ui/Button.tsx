import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-soft",
  secondary: "bg-surface-2 text-fg hover:bg-border",
  outline: "border border-border-strong bg-transparent text-fg hover:bg-surface-2",
  ghost: "bg-transparent text-fg hover:bg-surface-2",
  accent: "bg-accent text-on-accent hover:brightness-95 shadow-soft",
  danger: "bg-danger text-white hover:brightness-110",
  link: "h-auto min-h-0 rounded-sm p-0 text-primary underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-10 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] gap-2.5 px-7 text-base",
  icon: "h-11 w-11 shrink-0",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

const base =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-control font-medium " +
  "transition-[transform,background-color,box-shadow,opacity] duration-150 ease-snap " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

/** Class string for non-button elements (e.g. a Next.js <Link>) that should look like a Button. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** Render the child element (e.g. <Link>) with button styles instead of a <button>. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, isLoading = false, startIcon, endIcon, asChild = false, className, disabled, type, children, ...props },
  ref,
) {
  const classes = buttonClasses({ variant, size, className });

  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {/* Label stays in layout while loading so the button never changes width. */}
      <span className={cn("inline-flex items-center justify-center gap-[inherit]", isLoading && "invisible")}>
        {startIcon}
        {children}
        {endIcon}
      </span>
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner />
        </span>
      )}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "size" | "children" | "startIcon" | "endIcon"> {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = "ghost", children, ...props },
  ref,
) {
  return (
    <Button ref={ref} size="icon" variant={variant} aria-label={label} {...props}>
      {children}
    </Button>
  );
});
