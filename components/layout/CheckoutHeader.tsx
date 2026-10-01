import { Lock } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "./ThemeToggle";

/** Distraction-free: no navigation, no footer. Just logo, a way back, and a reassurance. */
export function CheckoutHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <p className="hidden items-center gap-2 text-sm text-fg-muted sm:flex">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Secure checkout
        </p>
        <div className="flex items-center gap-1">
          <Link href="/cart" className="rounded-control px-3 py-2 text-[0.9375rem] font-medium text-primary hover:bg-primary-soft">
            Back to bag
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
