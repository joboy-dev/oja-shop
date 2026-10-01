import { Heart, LogIn } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { UserMenu } from "@/components/auth/UserMenu";
import { CartButton } from "@/components/cart/CartButton";
import { CommandSearch } from "@/components/search/CommandSearch";
import { Button, IconButton } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";
import type { CategoryDTO } from "@/lib/types/catalog";
import type { UserSummary } from "@/lib/types/user";
import { HeaderShell } from "./HeaderShell";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ user, categories }: { user: UserSummary | null; categories: CategoryDTO[] }) {
  return (
    <HeaderShell>
      <div className="container-page flex h-16 items-center gap-2 lg:gap-4">
        <MobileNav categories={categories} user={user} />
        <Logo className="mr-1 lg:mr-4" />
        <NavLinks links={siteConfig.nav} className="hidden items-center md:flex" />

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <CommandSearch categories={categories} />
          <IconButton label="Wishlist" asChild className="hidden sm:inline-flex">
            <Link href="/account/wishlist">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Link>
          </IconButton>
          <ThemeToggle className="hidden md:inline-flex" />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild variant="ghost" className="hidden px-3 sm:inline-flex" startIcon={<LogIn className="h-4 w-4" />}>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <CartButton />
        </div>
      </div>
    </HeaderShell>
  );
}
