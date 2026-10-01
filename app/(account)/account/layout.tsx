import { LazyCartDrawer } from "@/components/cart/LazyCartDrawer";
import { CartSync } from "@/components/cart/CartSync";
import { AccountNav } from "@/components/account/AccountNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { requireUser } from "@/server/auth/session";
import { getCategories } from "@/server/services/catalog.service";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");
  const categories = await getCategories();

  return (
    <>
      <CartSync authenticated />
      <SiteHeader user={{ id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }} categories={categories} />
      <main id="main" className="container-page min-h-[60vh] pb-8 pt-8 sm:pt-12">
        <h1 className="mb-6">My account</h1>
        <AccountNav />
        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
      <LazyCartDrawer />
    </>
  );
}
