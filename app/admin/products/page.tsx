import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdminTable, Td, Th, Tr } from "@/components/admin/AdminTable";
import { PageTitle } from "@/components/admin/PageTitle";
import { ProductRowMenu, VisibilitySwitch } from "@/components/admin/ProductRowActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { formatMoney } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";
import { requireAdmin } from "@/server/auth/session";
import { getCategoryOptions, listProducts } from "@/server/services/admin-catalog.service";

export const metadata: Metadata = { title: "Products" };
type Params = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const statuses = [["", "All"], ["active", "Visible"], ["hidden", "Hidden"], ["low", "Low stock"], ["out", "Sold out"]] as const;

export default async function AdminProducts({ searchParams }: { searchParams: Params }) {
  await requireAdmin("/admin/products");
  const sp = await searchParams;
  const status = statuses.find(([v]) => v && v === first(sp.status))?.[0] as "active" | "hidden" | "low" | "out" | undefined;
  const q = first(sp.q)?.trim().slice(0, 60) || undefined;
  const category = first(sp.category) || undefined;
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);

  const [result, categories] = await Promise.all([listProducts({ q, status, category, page, pageSize: 20 }), getCategoryOptions()]);
  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ q, status, category, ...over })) if (v) p.set(k, v);
    return p.toString() ? `/admin/products?${p}` : "/admin/products";
  };
  const tab = (active: boolean) => cn("inline-flex min-h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,transform] active:scale-95", active ? "border-primary bg-primary-soft text-primary" : "border-border-strong hover:border-primary/50");

  return (
    <>
      <PageTitle title="Products" description={`${result.total} ${result.total === 1 ? "product" : "products"}`} action={<Button asChild startIcon={<Plus className="h-4 w-4" />}><Link href="/admin/products/new">Add product</Link></Button>} />

      <div className="hide-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {statuses.map(([v, label]) => <Link key={v} href={href({ status: v || undefined, page: undefined })} className={tab((status ?? "") === v)}>{label}</Link>)}
      </div>

      <form action="/admin/products" role="search" className="mb-6 flex flex-wrap gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="min-w-56 flex-1 sm:max-w-sm"><Input name="q" defaultValue={q} placeholder="Search by name" aria-label="Search products" startAdornment={<Search className="h-4 w-4" />} /></div>
        <select name="category" defaultValue={category ?? ""} aria-label="Category" className="h-11 rounded-control border border-border-strong bg-surface px-3 text-base">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button type="submit" variant="secondary">Filter</Button>
      </form>

      {result.items.length === 0 ? (
        <EmptyState title="No products match" description={q || status || category ? "Try clearing the filters." : "Add your first product to start selling."} action={<Button asChild><Link href="/admin/products/new">Add product</Link></Button>} />
      ) : (
        <>
          <AdminTable caption="Products">
            <thead><tr><Th>Product</Th><Th>Category</Th><Th className="text-right">Price</Th><Th className="text-right">Stock</Th><Th>Visibility</Th><Th><span className="sr-only">Actions</span></Th></tr></thead>
            <tbody>
              {result.items.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2">{p.imageUrl && <Image src={p.imageUrl} alt="" fill sizes="44px" className="object-cover" />}</div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="block truncate font-medium hover:text-primary">{p.name}</Link>
                        <p className="truncate font-mono text-xs text-fg-muted">/{p.slug}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-fg-muted">{p.categoryName}</Td>
                  <Td className="text-right font-mono tabular">{formatMoney(p.price)}</Td>
                  <Td className="text-right"><Badge tone={p.stock === 0 ? "danger" : p.stock <= 5 ? "accent" : "neutral"}>{p.stock === 0 ? "Sold out" : p.stock}</Badge></Td>
                  <Td><VisibilitySwitch id={p.id} name={p.name} isActive={p.isActive} /></Td>
                  <Td className="text-right"><ProductRowMenu id={p.id} slug={p.slug} name={p.name} isActive={p.isActive} /></Td>
                </Tr>
              ))}
            </tbody>
          </AdminTable>
          <div className="mt-8"><Pagination page={result.page} totalPages={result.totalPages} buildHref={(n) => href({ page: n > 1 ? String(n) : undefined })} /></div>
        </>
      )}
    </>
  );
}
