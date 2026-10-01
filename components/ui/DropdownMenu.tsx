"use client";

import * as RMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils/cn";

export const DropdownMenu = RMenu.Root;
export const DropdownMenuTrigger = RMenu.Trigger;

export function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 8,
  ...props
}: RMenu.DropdownMenuContentProps) {
  return (
    <RMenu.Portal>
      <RMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[60] min-w-52 origin-[var(--radix-dropdown-menu-content-transform-origin)] rounded-card border border-border bg-surface p-1.5 shadow-overlay",
          "data-[state=open]:animate-[pop-in_160ms_var(--ease-snap)] data-[state=closed]:animate-[pop-out_100ms_ease-out]",
          className,
        )}
        {...props}
      />
    </RMenu.Portal>
  );
}

export function DropdownMenuItem({ className, destructive, ...props }: RMenu.DropdownMenuItemProps & { destructive?: boolean }) {
  return (
    <RMenu.Item
      className={cn(
        "flex min-h-10 cursor-pointer select-none items-center gap-2.5 rounded-control px-3 py-2 text-[0.9375rem] outline-none",
        "data-[highlighted]:bg-primary-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        destructive && "text-danger data-[highlighted]:bg-danger-soft",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: RMenu.DropdownMenuLabelProps) {
  return <RMenu.Label className={cn("px-3 py-1.5 text-xs font-medium text-fg-muted", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: RMenu.DropdownMenuSeparatorProps) {
  return <RMenu.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />;
}
