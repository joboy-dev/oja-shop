import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderItemsList } from "@/components/order/OrderItemsList";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { OrderTotals } from "@/components/order/OrderTotals";
import { PaymentInstructions } from "@/components/order/PaymentInstructions";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { paymentMethods, shippingMethods } from "@/lib/config/shop";
import { formatDateTime } from "@/lib/utils/date";
import { requireUser } from "@/server/auth/session";
import { getUserOrder } from "@/server/services/order.service";
import { getBankDetails } from "@/server/services/payment.service";

type Props = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order ${(await params).orderNumber}`, robots: { index: false } };
}

export default async function OrderPage({ params }: Props) {
  const { orderNumber } = await params;
  const user = await requireUser(`/account/orders/${orderNumber}`);
  const order = await getUserOrder(user.id, orderNumber);
  if (!order) notFound();

  const a = order.shippingAddress;
  const awaitingTransfer = order.paymentMethod === "bank_transfer" && order.paymentStatus === "unpaid" && order.status !== "cancelled";

  return (
    <div>
      <Breadcrumbs items={[{ label: "Orders", href: "/account/orders" }, { label: order.orderNumber }]} />
      <div className="mb-8 mt-4 flex flex-wrap items-center gap-3">
        <h2 className="font-mono text-2xl tabular">{order.orderNumber}</h2>
        <OrderStatusBadge status={order.status} />
        <Badge tone={order.paymentStatus === "paid" ? "success" : "outline"}>{order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Unpaid"}</Badge>
        <p className="w-full text-sm text-fg-muted sm:ml-auto sm:w-auto">Placed {formatDateTime(order.placedAt)}</p>
      </div>

      {awaitingTransfer && <div className="mb-8"><PaymentInstructions bank={getBankDetails()} orderNumber={order.orderNumber} total={order.total} /></div>}

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="rounded-sheet border border-border bg-surface p-6">
            <h3 className="mb-5 text-xl">Items</h3>
            <OrderItemsList items={order.items} />
            <div className="mt-6 border-t border-border pt-5"><OrderTotals order={order} /></div>
          </section>
          <section className="grid gap-6 rounded-sheet border border-border bg-surface p-6 sm:grid-cols-3">
            <div>
              <h3 className="eyebrow !text-xs">Delivering to</h3>
              <address className="mt-3 text-[0.9375rem] not-italic leading-relaxed">{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state}<br /><span className="font-mono text-sm tabular">{a.phone}</span></address>
            </div>
            <div>
              <h3 className="eyebrow !text-xs">Delivery</h3>
              <p className="mt-3 text-[0.9375rem] font-medium">{shippingMethods[order.shippingMethod].label}</p>
              <p className="text-sm text-fg-muted">{shippingMethods[order.shippingMethod].description}</p>
            </div>
            <div>
              <h3 className="eyebrow !text-xs">Payment</h3>
              <p className="mt-3 text-[0.9375rem] font-medium">{paymentMethods[order.paymentMethod].label}</p>
            </div>
          </section>
          {order.notes && (
            <section className="rounded-sheet border border-border bg-surface p-6">
              <h3 className="eyebrow !text-xs">Your notes</h3>
              <p className="mt-3 whitespace-pre-line text-[0.9375rem] text-fg-muted">{order.notes}</p>
            </section>
          )}
        </div>

        <aside className="rounded-sheet border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h3 className="mb-6 text-xl">Order status</h3>
          <OrderStatusTimeline status={order.status} events={order.events} />
          <p className="mt-8 border-t border-border pt-5 text-sm text-fg-muted">
            Questions about this order? <Link href="/contact" className="font-medium text-primary underline underline-offset-2">Contact us</Link> and quote {order.orderNumber}.
          </p>
        </aside>
      </div>
    </div>
  );
}
