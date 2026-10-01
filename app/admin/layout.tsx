import type { Metadata } from "next";
import { AdminMobileBar } from "@/components/admin/AdminMobileBar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/server/auth/session";
import { listMessages } from "@/server/services/admin-misc.service";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin("/admin");
  const unread = (await listMessages()).filter((m) => m.status === "new").length;

  return (
    <div className="min-h-dvh lg:flex">
      <AdminSidebar user={{ name: admin.name, email: admin.email, image: admin.image }} unread={unread} />
      <div className="min-w-0 flex-1">
        <AdminMobileBar unread={unread} />
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
