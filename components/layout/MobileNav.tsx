"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { IconButton } from "@/components/ui/Button";
import type { CategoryDTO } from "@/lib/types/catalog";
import type { UserSummary } from "@/lib/types/user";

// The sheet library is fetched the first time the menu is opened.
const MobileNavSheet = dynamic(() => import("./MobileNavSheet"), { ssr: false });

export function MobileNav({ categories, user }: { categories: CategoryDTO[]; user: UserSummary | null }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  if (open && !everOpened) setEverOpened(true);

  return (
    <>
      <IconButton label="Open menu" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </IconButton>
      {everOpened && <MobileNavSheet open={open} setOpen={setOpen} categories={categories} user={user} />}
    </>
  );
}
