import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusPanel } from "@/components/admin/OrderStatusPanel";
import { OrderItemsList } from "@/components/order/OrderItemsList";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { OrderTotals } from "@/components/order/OrderTotals";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { paymentMethods, shippingMethods } from "@/lib/config/shop";
import { formatDateTime } from "@/lib/utils/date";
import { requireAdmin } from "@/server/auth/session";
import { getOrder } from "@/server/services/admin-order.service";

type Props = { params: Promise<{ orderNumber: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order ${(await params).orderNumber}` };
}

export default async function AdminOrderPage({ params }: Props) {
  const { orderNumber } = await params;
  await requireAdmin(`/admin/orders/${orderNumber}`);
  const order = await getOrder(orderNumber);
  if (!order) notFound();
  const a = order.shippingAddress;

  return (
    <>
      <Breadcrumbs items={[{ label: "Orders", href: "/admin/orders" }, { label: order.orderNumber }]} />
      <div className="mb-8 mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-[clamp(1.5rem,3vw,2rem)] tabular">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
        <Badge tone={order.paymentStatus === "paid" ? "success" : "outline"}>{order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Unpaid"}</Badge>
        <p className="w-full text-sm text-fg-muted sm:ml-auto sm:w-auto">Placed {formatDateTime(order.placedAt)}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="rounded-card border border-border bg-surface p-6">
            <h2 className="mb-5 text-xl">Items</h2>
            <OrderItemsList items={order.items} />
            <div className="mt-6 border-t border-border pt-5"><OrderTotals order={order} /></div>
          </section>

          <section className="grid gap-6 rounded-card border border-border bg-surface p-6 sm:grid-cols-3">
            <div>
              <h2 className="eyebrow !text-xs">Customer</h2>
              <p className="mt-3 text-[0.9375rem]"><a href={`mailto:${order.email}`} className="break-all text-primary hover:underline">{order.email}</a></p>
              <p className="font-mono text-sm tabular text-fg-muted">{order.phone}</p>
            </div>
            <div>
              <h2 className="eyebrow !text-xs">Deliver to</h2>
              <address className="mt-3 text-[0.9375rem] not-italic leading-relaxed">{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state}<br /><span className="font-mono text-sm tabular text-fg-muted">{a.phone}</span></address>
            </div>
            <div>
              <h2 className="eyebrow !text-xs">Method</h2>
              <p className="mt-3 text-[0.9375rem] font-medium">{shippingMethods[order.shippingMethod].label}</p>
              <p className="text-sm text-fg-muted">{paymentMethods[order.paymentMethod].label}</p>
            </div>
          </section>

          {order.notes && (
            <section className="rounded-card border border-accent/50 bg-accent/10 p-6">
              <h2 className="eyebrow !text-xs !text-fg">Customer note</h2>
              <p className="mt-3 whitespace-pre-line text-[0.9375rem]">{order.notes}</p>
            </section>
          )}

          <section className="rounded-card border border-border bg-surface p-6">
            <h2 className="mb-4 text-xl">Emails sent for this order</h2>
            {order.emails.length === 0 ? (
              <p className="text-fg-muted">No emails have been sent yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {order.emails.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-start gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
                    <Badge tone={e.status === "sent" ? "success" : "danger"}>{e.status === "sent" ? "Sent" : "Failed"}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.9375rem] font-medium">{e.template.replace(/-/g, " ")} <span className="font-normal text-fg-muted">to {e.to}</span></p>
                      {e.error && <p className="mt-0.5 break-words text-sm text-danger">{e.error}</p>}
                    </div>
                    <p className="text-sm text-fg-muted">{formatDateTime(e.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <section className="rounded-card border border-border bg-surface p-6">
            <h2 className="mb-5 text-xl">Manage</h2>
            <OrderStatusPanel orderNumber={order.orderNumber} status={order.status} paymentStatus={order.paymentStatus} />
          </section>
          <section className="rounded-card border border-border bg-surface p-6">
            <h2 className="mb-5 text-xl">History</h2>
            <OrderStatusTimeline status={order.status} events={order.events} />
          </section>
          <Link href={`/account/orders/${order.orderNumber}`} className="block text-center text-sm text-fg-muted underline underline-offset-4 hover:text-fg">See what the customer sees</Link>
        </aside>
      </div>
    </>
  );
}
