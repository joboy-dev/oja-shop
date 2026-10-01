"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function NavLinks({
  links,
  className,
  linkClassName,
  onNavigate,
}: {
  links: readonly { label: string; href: string }[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={className}>
      {links.map((link) => {
        const active = link.href === "/shop" ? pathname === "/shop" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-control px-3 py-2 text-[0.9375rem] font-medium text-fg-muted transition-colors duration-150 hover:text-fg aria-[current=page]:text-fg",
              linkClassName,
            )}
          >
            {link.label}
            {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
