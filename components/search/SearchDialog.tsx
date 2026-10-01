"use client";

import { Command } from "cmdk";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/Kbd";
import { Spinner } from "@/components/ui/Spinner";
import type { CategoryDTO } from "@/lib/types/catalog";
import { formatMoney } from "@/lib/utils/money";
import { searchProductsAction, type SearchHit } from "@/server/actions/catalog.actions";

export default function SearchDialog({ categories, open, setOpen }: { categories: CategoryDTO[]; open: boolean; setOpen: (o: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  /** Highlighted row. Controlled so Enter always opens the top result once results arrive. */
  const [active, setActive] = useState("");

  // Debounced live search; stale responses are ignored.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const id = ++requestId.current;
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await searchProductsAction(term);
      if (id !== requestId.current) return;
      const next = res.ok ? res.data : [];
      setHits(next);
      setActive(next[0]?.slug ?? `all-${term}`);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  const term = query.trim();
  const searching = term.length >= 2;

  return (
      <Command.Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            setQuery("");
            setHits([]);
            setActive("");
          }
        }}
        label="Search the shop"
        value={active}
        onValueChange={setActive}
        shouldFilter={false}
        overlayClassName="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]"
        contentClassName="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-sheet border border-border bg-surface shadow-overlay"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          {loading ? <Spinner className="h-5 w-5 text-primary" /> : <Search className="h-5 w-5 text-fg-muted" aria-hidden="true" />}
          <Command.Input
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              if (v.trim().length < 2) {
                setHits([]);
                setActive("");
              }
            }}
            placeholder="Search mugs, throws, candles…"
            className="h-14 flex-1 bg-transparent text-base text-fg placeholder:text-fg-muted/70 focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain p-2">
          {searching && !loading && hits.length === 0 && (
            <Command.Empty className="px-4 py-10 text-center text-fg-muted">
              Nothing matches “{term}”. Try a shorter word, like “mug” or “candle”.
            </Command.Empty>
          )}

          {searching && hits.length > 0 && (
            <Command.Group heading="Products" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fg-muted">
              {hits.map((h) => (
                <Command.Item
                  key={h.slug}
                  value={h.slug}
                  onSelect={() => go(`/products/${h.slug}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-control px-3 py-2 data-[selected=true]:bg-primary-soft"
                >
                  <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {h.imageUrl && <Image src={h.imageUrl} alt="" fill sizes="40px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{h.name}</span>
                    <span className="block text-sm text-fg-muted">{h.category}</span>
                  </span>
                  <span className="font-mono text-sm tabular">{formatMoney(h.price)}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {searching && (
            <Command.Item
              value={`all-${term}`}
              onSelect={() => go(`/shop?q=${encodeURIComponent(term)}`)}
              className="mt-1 flex cursor-pointer items-center justify-between rounded-control px-3 py-3 text-primary data-[selected=true]:bg-primary-soft"
            >
              <span className="font-medium">See all results for “{term}”</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Command.Item>
          )}

          {!searching && (
            <Command.Group heading="Browse" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fg-muted">
              {categories.map((c) => (
                <Command.Item
                  key={c.slug}
                  value={c.slug}
                  onSelect={() => go(`/shop/${c.slug}`)}
                  className="flex cursor-pointer items-center justify-between rounded-control px-3 py-3 data-[selected=true]:bg-primary-soft"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="font-mono text-sm tabular text-fg-muted">{c.productCount}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
  );
}
