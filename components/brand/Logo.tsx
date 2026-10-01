import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/config/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-7 w-7", className)}>
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="3.6" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center gap-2.5 text-primary", className)}
    >
      <LogoMark />
      <span className="font-display text-2xl font-bold leading-none tracking-tight text-fg">
        {siteConfig.name}
      </span>
    </Link>
  );
}
