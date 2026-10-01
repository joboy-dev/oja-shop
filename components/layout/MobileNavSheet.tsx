"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { siteConfig } from "@/lib/config/site";
import type { CategoryDTO } from "@/lib/types/catalog";
import type { UserSummary } from "@/lib/types/user";
import { ThemeToggle } from "./ThemeToggle";

export default function MobileNavSheet({
  open,
  setOpen,
  categories,
  user,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  categories: CategoryDTO[];
  user: UserSummary | null;
}) {
  const close = () => setOpen(false);
  const row = "flex min-h-12 items-center rounded-control px-3 text-lg font-medium transition-colors hover:bg-surface-2";

  return (
      <Sheet open={open} onOpenChange={setOpen} side="left" title={siteConfig.name} description="Menu">
        <nav aria-label="Mobile" className="flex flex-col gap-1 pt-2">
          <Link href="/shop" onClick={close} className={row}>
            All products
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} onClick={close} className={`${row} justify-between`}>
              {c.name}
              <span className="font-mono text-sm tabular text-fg-muted">{c.productCount}</span>
            </Link>
          ))}
          <div className="my-3 h-px bg-border" />
          <Link href="/about" onClick={close} className={row}>
            About
          </Link>
          <Link href="/contact" onClick={close} className={row}>
            Contact
          </Link>
          <Link href="/faq" onClick={close} className={row}>
            FAQ
          </Link>
        </nav>
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          {user ? (
            <Button asChild variant="secondary" className="flex-1">
              <Link href="/account" onClick={close}>
                My account
              </Link>
            </Button>
          ) : (
            <Button asChild className="flex-1" startIcon={<LogIn className="h-4 w-4" />}>
              <Link href="/login" onClick={close}>
                Sign in
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </Sheet>
  );
}
