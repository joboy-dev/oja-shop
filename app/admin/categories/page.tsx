import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { PageTitle } from "@/components/admin/PageTitle";
import { requireAdmin } from "@/server/auth/session";
import { listCategories } from "@/server/services/admin-catalog.service";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategories() {
  await requireAdmin("/admin/categories");
  return (
    <>
      <PageTitle title="Categories" description="Group products so people can browse." />
      <CategoryManager categories={await listCategories()} />
    </>
  );
}
