import { LazyCartDrawer } from "@/components/cart/LazyCartDrawer";
import { CartSync } from "@/components/cart/CartSync";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSessionUser } from "@/server/auth/session";
import { getCategories } from "@/server/services/catalog.service";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [user, categories] = await Promise.all([getSessionUser(), getCategories()]);
  const summary = user ? { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role } : null;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 font-medium text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <CartSync authenticated={!!user} />
      <SiteHeader user={summary} categories={categories} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter />
      <LazyCartDrawer />
    </>
  );
}
