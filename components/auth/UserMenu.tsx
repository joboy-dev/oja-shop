"use client";

import { Heart, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { signOut } from "@/lib/auth/client";
import type { UserSummary } from "@/lib/types/user";

export function UserMenu({ user }: { user: UserSummary }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-150 active:scale-95 data-[state=open]:ring-2 data-[state=open]:ring-primary"
      >
        <Avatar name={user.name} src={user.image} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="max-w-56 truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/account"><User className="h-4 w-4" aria-hidden="true" />My account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders"><Package className="h-4 w-4" aria-hidden="true" />Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/wishlist"><Heart className="h-4 w-4" aria-hidden="true" />Wishlist</Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin"><LayoutDashboard className="h-4 w-4" aria-hidden="true" />Admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
