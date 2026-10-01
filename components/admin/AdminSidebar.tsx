import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AdminNav } from "./AdminNav";

export function AdminSidebar({ user, unread }: { user: { name: string; email: string; image: string | null }; unread: number }) {
  return (
    <aside aria-label="Admin sidebar" className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
      <div className="flex items-center justify-between px-1 pb-6 pt-1">
        <Logo href="/admin" />
        <ThemeToggle />
      </div>
      <p className="eyebrow mb-2 px-3 !text-xs">Manage</p>
      <AdminNav unread={unread} />
      <Link href="/" className="mt-3 flex min-h-11 items-center gap-3 rounded-control px-3 text-[0.9375rem] font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
        <ExternalLink className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        View shop
      </Link>
      <div className="mt-auto flex items-center gap-3 border-t border-border px-1 pt-4">
        <Avatar name={user.name} src={user.image} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-fg-muted">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}
