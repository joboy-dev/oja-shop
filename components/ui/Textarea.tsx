import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { controlBase, controlBorder } from "./Field";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlBorder(invalid), "min-h-24 resize-y py-2.5", className)}
      {...props}
    />
  );
});
