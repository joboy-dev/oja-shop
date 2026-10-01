import { AlertTriangle, Banknote, Package, PackageX, ShoppingBag, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminTable, Td, Th, Tr } from "@/components/admin/AdminTable";
import { PageTitle } from "@/components/admin/PageTitle";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { formatRelative } from "@/lib/utils/date";
import { formatMoney } from "@/lib/utils/money";
import { requireAdmin } from "@/server/auth/session";
import { getDashboard } from "@/server/services/admin-order.service";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const admin = await requireAdmin("/admin");
  const d = await getDashboard();

  return (
    <>
      <PageTitle title={`Hello, ${admin.name.split(" ")[0]}`} description="Here's how the shop is doing." />

      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value={formatMoney(d.revenueToday)} icon={Banknote} />
        <StatCard label="Revenue, 30 days" value={formatMoney(d.revenue30d)} icon={TrendingUp} />
        <StatCard label="Orders, 30 days" value={String(d.orders30d)} icon={ShoppingBag} />
        <StatCard label="Average order" value={formatMoney(d.averageOrder30d)} hint="Last 30 days" icon={Package} />
      </section>

      <section aria-label="Needs attention" className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders to handle" value={String(d.awaitingAction)} hint="Confirmed or being prepared" icon={Package} href="/admin/orders?status=confirmed" tone={d.awaitingAction > 0 ? "warn" : "default"} />
        <StatCard label="Low stock" value={String(d.lowStock)} hint="5 or fewer left" icon={AlertTriangle} href="/admin/products?status=low" tone={d.lowStock > 0 ? "warn" : "default"} />
        <StatCard label="Sold out" value={String(d.outOfStock)} hint="Visible but can't be bought" icon={PackageX} href="/admin/products?status=out" tone={d.outOfStock > 0 ? "danger" : "default"} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="mb-5 text-xl">Revenue, last 14 days</h2>
          <RevenueChart data={d.daily} />
        </section>
        <section className="rounded-card border border-border bg-surface p-5">
          <h2 className="mb-4 text-xl">Top products</h2>
          {d.topProducts.length === 0 ? (
            <p className="text-fg-muted">No sales in the last 30 days yet.</p>
          ) : (
            <ol className="space-y-3">
              {d.topProducts.map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-xs">{i + 1}</span>
                  <Link href={`/products/${p.slug}`} className="min-w-0 flex-1 truncate font-medium hover:text-primary">{p.name}</Link>
                  <span className="font-mono text-sm tabular text-fg-muted">{p.units} sold</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline">View all</Link>
        </div>
        {d.recentOrders.length === 0 ? (
          <p className="rounded-card border border-dashed border-border-strong p-8 text-center text-fg-muted">No orders yet. They&apos;ll appear here as they come in.</p>
        ) : (
          <AdminTable caption="Recent orders">
            <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Status</Th><Th className="text-right">Total</Th><Th>When</Th></tr></thead>
            <tbody>
              {d.recentOrders.map((o) => (
                <Tr key={o.id}>
                  <Td><Link href={`/admin/orders/${o.orderNumber}`} className="font-mono font-semibold text-primary hover:underline">{o.orderNumber}</Link></Td>
                  <Td className="max-w-48 truncate text-fg-muted">{o.email}</Td>
                  <Td><OrderStatusBadge status={o.status} /></Td>
                  <Td className="text-right font-mono tabular">{formatMoney(o.total)}</Td>
                  <Td className="whitespace-nowrap text-fg-muted">{formatRelative(o.placedAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </section>
    </>
  );
}
