"use client";

import { Inbox, LayoutDashboard, Package, ShoppingBag, Tags, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
] as const;

export function AdminNav({ unread = 0, onNavigate }: { unread?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, ...rest }) => {
        const active = "exact" in rest && rest.exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-control px-3 text-[0.9375rem] font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.98]",
              active ? "bg-primary-soft text-primary" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
            {label}
            {label === "Messages" && unread > 0 && (
              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 font-mono text-xs font-bold text-on-accent">{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

