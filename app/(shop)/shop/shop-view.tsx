import { SearchX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActiveFilters } from "@/components/product/ActiveFilters";
import { FilterPanel } from "@/components/product/FilterPanel";
import { FilterSheet } from "@/components/product/FilterSheet";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ResultsFrame, ShopNavProvider } from "@/components/product/ShopNav";
import { SortSelect } from "@/components/product/SortSelect";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import type { CategoryDTO } from "@/lib/types/catalog";
import { parseShopFilters } from "@/lib/validators/catalog";
import { getSessionUser } from "@/server/auth/session";
import { getCategories, listProducts } from "@/server/services/catalog.service";
import { getWishlistIds } from "@/server/services/wishlist.service";

type SearchParams = Record<string, string | string[] | undefined>;

/** Shared by /shop and /shop/[category]. */
export async function ShopView({ category, searchParams }: { category?: CategoryDTO; searchParams: SearchParams }) {
  const filters = parseShopFilters(searchParams, category?.slug);
  const basePath = category ? `/shop/${category.slug}` : "/shop";

  const [result, categories, user] = await Promise.all([listProducts(filters), getCategories(), getSessionUser()]);

  const hrefFor = (page: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      const val = Array.isArray(v) ? v[0] : v;
      if (val && k !== "page") qs.set(k, val);
    }
    if (page > 1) qs.set("page", String(page));
    return qs.toString() ? `${basePath}?${qs}` : basePath;
  };
  if (filters.page > result.totalPages) redirect(hrefFor(result.totalPages));

  const wishedIds = user ? await getWishlistIds(user.id) : [];
  const title = category ? category.name : filters.q ? `Results for “${filters.q}”` : "All products";
  const description = category?.description ?? (filters.q ? undefined : "Everything in the shop, newest first.");
  const first = (result.page - 1) * result.pageSize + 1;
  const last = first + result.items.length - 1;

  return (
    <div className="container-page pb-8 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: category ? "/shop" : undefined },
          ...(category ? [{ label: category.name }] : []),
        ]}
      />

      <header className="mb-8 mt-5 max-w-2xl">
        <h1>{title}</h1>
        {description && <p className="mt-3 text-lg text-fg-muted">{description}</p>}
      </header>

      <ShopNavProvider>
        <div className="sticky top-16 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex items-center gap-3">
            <FilterSheet categories={categories} activeCategory={category?.slug} total={result.total} />
            <p className="text-sm text-fg-muted" aria-live="polite">
              {result.total === 0 ? "No products" : `${first}–${last} of ${result.total} ${result.total === 1 ? "product" : "products"}`}
            </p>
          </div>
          <SortSelect />
        </div>

        <div className="mb-6 empty:hidden">
          <ActiveFilters />
        </div>

        <div className="grid gap-10 lg:grid-cols-[14.5rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel categories={categories} activeCategory={category?.slug} />
            </div>
          </aside>

          <div>
            <ResultsFrame>
              {result.items.length > 0 ? (
                <ProductGrid products={result.items} wishedIds={wishedIds} authenticated={!!user} columns={3} priorityCount={3} headingLevel={2} />
              ) : (
                <EmptyState
                  icon={SearchX}
                  title="No pieces match those filters"
                  description="Try widening the price range or clearing a filter."
                  action={
                    <Button asChild>
                      <Link href={basePath}>Clear filters</Link>
                    </Button>
                  }
                />
              )}
            </ResultsFrame>
            <div className="mt-12">
              <Pagination page={result.page} totalPages={result.totalPages} buildHref={hrefFor} />
            </div>
          </div>
        </div>
      </ShopNavProvider>
    </div>
  );
}
