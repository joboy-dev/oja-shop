'use client';

import React from "react";
import clsx from "clsx";
import { variantStyles } from "@/lib/constants/styles";

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  className?: string;
  useVariantStyles?: boolean;
  onClick?: () => void;
};

export default function Badge({
  children,
  variant = "primary",
  className,
  useVariantStyles=true,
  onClick
}: BadgeProps) {
  return (
    <span
      onClick={() => onClick ? onClick() : null}
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors",
        useVariantStyles ? variantStyles[variant]: "",
        className
      )}
    >
      {children}
    </span>
  );
}
