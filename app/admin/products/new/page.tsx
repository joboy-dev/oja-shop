import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/PageTitle";
import { ProductForm } from "@/components/admin/ProductForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { requireAdmin } from "@/server/auth/session";
import { getCategoryOptions } from "@/server/services/admin-catalog.service";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin("/admin/products/new");
  const categories = await getCategoryOptions();
  return (
    <>
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: "New" }]} />
      <div className="mt-4"><PageTitle title="New product" /></div>
      <ProductForm categories={categories} />
    </>
  );
}
