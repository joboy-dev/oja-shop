import type { Metadata } from "next";
import { AdminTable, Td, Th, Tr } from "@/components/admin/AdminTable";
import { PageTitle } from "@/components/admin/PageTitle";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils/date";
import { formatMoney } from "@/lib/utils/money";
import { requireAdmin } from "@/server/auth/session";
import { listCustomers } from "@/server/services/admin-misc.service";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomers() {
  await requireAdmin("/admin/customers");
  const customers = await listCustomers();
  return (
    <>
      <PageTitle title="Customers" description={`${customers.length} signed up with Google`} />
      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="People appear here after they sign in for the first time." />
      ) : (
        <AdminTable caption="Customers">
          <thead><tr><Th>Customer</Th><Th className="text-right">Orders</Th><Th className="text-right">Spent</Th><Th>Joined</Th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} src={c.image} size="sm" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">{c.name}{c.role === "admin" && <Badge tone="accent">Admin</Badge>}</p>
                      <p className="truncate text-sm text-fg-muted">{c.email}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-right font-mono tabular">{c.orderCount}</Td>
                <Td className="text-right font-mono tabular">{formatMoney(c.totalSpent)}</Td>
                <Td className="whitespace-nowrap text-fg-muted">{formatDate(c.createdAt)}</Td>
              </Tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}
