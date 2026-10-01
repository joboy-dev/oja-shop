"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { IconButton } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AdminNav } from "./AdminNav";

export function AdminMobileBar({ unread }: { unread: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border px-3 lg:hidden">
      <IconButton label="Open admin menu" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </IconButton>
      <Logo href="/admin" />
      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">Admin</span>
      <Sheet open={open} onOpenChange={setOpen} side="left" title="Admin" description="Run the shop">
        <div className="pt-2">
          <AdminNav unread={unread} onNavigate={() => setOpen(false)} />
        </div>
      </Sheet>
    </div>
  );
}
