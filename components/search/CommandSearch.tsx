"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import type { CategoryDTO } from "@/lib/types/catalog";

// The palette (cmdk + dialog) is only fetched the first time someone opens search.
const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });

export function CommandSearch({ categories }: { categories: CategoryDTO[] }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  if (open && !everOpened) setEverOpened(true);

  // ⌘K / Ctrl+K from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-11 w-56 items-center gap-2.5 rounded-control border border-border-strong bg-surface/70 px-3.5 text-left text-[0.9375rem] text-fg-muted transition-[border-color,background-color,transform] duration-150 hover:border-primary/60 hover:bg-surface active:scale-[0.99] lg:flex xl:w-64"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">Search the shop</span>
        <Kbd>⌘K</Kbd>
      </button>
      <IconButton label="Search" className="lg:hidden" onClick={() => setOpen(true)}>
        <Search className="h-5 w-5" aria-hidden="true" />
      </IconButton>

      {everOpened && <SearchDialog categories={categories} open={open} setOpen={setOpen} />}
    </>
  );
}
