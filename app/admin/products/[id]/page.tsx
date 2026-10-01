import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/PageTitle";
import { ProductForm } from "@/components/admin/ProductForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { requireAdmin } from "@/server/auth/session";
import { getCategoryOptions, getProductForEdit } from "@/server/services/admin-catalog.service";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/products/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [product, categories] = await Promise.all([getProductForEdit(id), getCategoryOptions()]);
  if (!product) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: product.name }]} />
      <div className="mt-4"><PageTitle title={product.name} /></div>
      <ProductForm key={product.id} product={product} categories={categories} />
    </>
  );
}
