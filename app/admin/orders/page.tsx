import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminTable, Td, Th, Tr } from "@/components/admin/AdminTable";
import { PageTitle } from "@/components/admin/PageTitle";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { orderStatusLabels, orderStatuses, type OrderStatus } from "@/lib/config/shop";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/date";
import { formatMoney } from "@/lib/utils/money";
import { requireAdmin } from "@/server/auth/session";
import { listOrders } from "@/server/services/admin-order.service";

export const metadata: Metadata = { title: "Orders" };
type Params = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminOrders({ searchParams }: { searchParams: Params }) {
  await requireAdmin("/admin/orders");
  const sp = await searchParams;
  const status = orderStatuses.find((s) => s === first(sp.status)) as OrderStatus | undefined;
  const q = first(sp.q)?.trim().slice(0, 60) || undefined;
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);

  const result = await listOrders({ status, q, page, pageSize: 20 });
  const href = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, q, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    return p.toString() ? `/admin/orders?${p}` : "/admin/orders";
  };
  const totalAll = Object.values(result.counts).reduce((a, b) => a + b, 0);
  const tab = (active: boolean) => cn("inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,transform] active:scale-95", active ? "border-primary bg-primary-soft text-primary" : "border-border-strong hover:border-primary/50");

  return (
    <>
      <PageTitle title="Orders" description={`${totalAll} in total`} />

      <div className="hide-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Link href={href({ status: undefined, page: undefined })} className={tab(!status)}>All <span className="font-mono text-xs">{totalAll}</span></Link>
        {orderStatuses.map((s) => (
          <Link key={s} href={href({ status: s, page: undefined })} className={tab(status === s)}>
            {orderStatusLabels[s]} <span className="font-mono text-xs">{result.counts[s] ?? 0}</span>
          </Link>
        ))}
      </div>

      <form action="/admin/orders" className="mb-6 flex max-w-md gap-2" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <Input name="q" defaultValue={q} placeholder="Order number or email" aria-label="Search orders" startAdornment={<Search className="h-4 w-4" />} />
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {result.items.length === 0 ? (
        <EmptyState title="No orders match" description={q || status ? "Try a different status or search." : "Orders will show up here as soon as customers place them."} />
      ) : (
        <>
          <AdminTable caption="Orders">
            <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Status</Th><Th>Payment</Th><Th className="text-right">Items</Th><Th className="text-right">Total</Th><Th>Placed</Th></tr></thead>
            <tbody>
              {result.items.map((o) => (
                <Tr key={o.id} className="hover:bg-surface-2/40">
                  <Td><Link href={`/admin/orders/${o.orderNumber}`} className="font-mono font-semibold text-primary hover:underline">{o.orderNumber}</Link></Td>
                  <Td className="max-w-52 truncate text-fg-muted">{o.email}</Td>
                  <Td><OrderStatusBadge status={o.status} /></Td>
                  <Td><Badge tone={o.paymentStatus === "paid" ? "success" : o.paymentStatus === "refunded" ? "neutral" : "outline"}>{o.paymentStatus === "paid" ? "Paid" : o.paymentStatus === "refunded" ? "Refunded" : o.paymentMethod === "bank_transfer" ? "Awaiting transfer" : "On delivery"}</Badge></Td>
                  <Td className="text-right font-mono tabular">{o.itemCount}</Td>
                  <Td className="text-right font-mono tabular">{formatMoney(o.total)}</Td>
                  <Td className="whitespace-nowrap text-fg-muted">{formatDateTime(o.placedAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </AdminTable>
          <div className="mt-8"><Pagination page={result.page} totalPages={result.totalPages} buildHref={(p) => href({ page: p > 1 ? String(p) : undefined })} /></div>
        </>
      )}
    </>
  );
}
