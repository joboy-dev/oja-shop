import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface FieldProps {
  label: string;
  /** Visible helper text under the control. */
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  /** A single form control (Input, Textarea, Select…). It receives id / aria-* automatically. */
  children: React.ReactElement<{ id?: string; invalid?: boolean; "aria-describedby"?: string }>;
}

/** Label + control + hint/error, wired for accessibility (for/id, aria-describedby, aria-invalid). */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const autoId = React.useId();
  const id = children.props.id ?? autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {React.cloneElement(children, { id, invalid: !!error, "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const controlBase =
  "w-full rounded-control border bg-surface px-3.5 text-base text-fg placeholder:text-fg-muted/70 " +
  "transition-[border-color,box-shadow] duration-150 " +
  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 " +
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60";

export const controlBorder = (invalid?: boolean) =>
  invalid ? "border-danger focus-visible:ring-danger/30 focus-visible:border-danger" : "border-border-strong";
