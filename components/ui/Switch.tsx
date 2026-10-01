"use client";

import * as RSwitch from "@radix-ui/react-switch";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface SwitchProps extends RSwitch.SwitchProps {
  label: string;
}

export function Switch({ label, id, className, ...props }: SwitchProps) {
  const autoId = useId();
  const sid = id ?? autoId;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <RSwitch.Root
        id={sid}
        className="relative h-6 w-11 shrink-0 rounded-full bg-border-strong transition-colors duration-200 data-[state=checked]:bg-primary"
        {...props}
      >
        <RSwitch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-soft transition-transform duration-200 ease-snap data-[state=checked]:translate-x-[1.375rem]" />
      </RSwitch.Root>
      <label htmlFor={sid} className="cursor-pointer text-[0.9375rem] font-medium">
        {label}
      </label>
    </div>
  );
}
