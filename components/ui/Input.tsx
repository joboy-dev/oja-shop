import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { controlBase, controlBorder } from "./Field";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, startAdornment, endAdornment, type = "text", ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        controlBorder(invalid),
        "h-11",
        startAdornment && "pl-10",
        endAdornment && "pr-10",
        className,
      )}
      {...props}
    />
  );
  if (!startAdornment && !endAdornment) return input;
  return (
    <div className="relative">
      {startAdornment && (
        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-fg-muted">
          {startAdornment}
        </span>
      )}
      {input}
      {endAdornment && <span className="absolute inset-y-0 right-1.5 grid place-items-center">{endAdornment}</span>}
    </div>
  );
});
