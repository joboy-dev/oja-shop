"use client";

import { Heart, LayoutGrid, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
] as const;

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="hide-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {items.map(({ href, label, icon: Icon, ...rest }) => {
        const active = "exact" in rest && rest.exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-[background-color,border-color,transform] duration-150 active:scale-95",
              active ? "border-primary bg-primary-soft text-primary" : "border-border-strong hover:border-primary/50",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
