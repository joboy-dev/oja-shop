import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SuccessSeal } from "@/components/brand/SuccessSeal";
import { OrderItemsList } from "@/components/order/OrderItemsList";
import { OrderTotals } from "@/components/order/OrderTotals";
import { PaymentInstructions } from "@/components/order/PaymentInstructions";
import { Button } from "@/components/ui/Button";
import { paymentMethods, shippingMethods } from "@/lib/config/shop";
import { requireUser } from "@/server/auth/session";
import { getUserOrder } from "@/server/services/order.service";
import { getBankDetails } from "@/server/services/payment.service";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function SuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const user = await requireUser(`/checkout/success/${orderNumber}`);
  const order = await getUserOrder(user.id, orderNumber);
  if (!order) notFound();

  const firstName = user.name.split(" ")[0];
  const a = order.shippingAddress;
  const shipping = shippingMethods[order.shippingMethod];
  const byTransfer = order.paymentMethod === "bank_transfer";

  return (
    <div className="container-page max-w-2xl pb-20 pt-10 sm:pt-16">
      <div className="text-center">
        <SuccessSeal />
        <h1 className="mt-8">Thank you, {firstName}.</h1>
        <p className="mt-3 text-lg text-fg-muted">Your order is confirmed. We&apos;ve emailed the details to {order.email}.</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-sm">
          Order number <span className="font-mono text-base font-semibold tabular">{order.orderNumber}</span>
        </p>
      </div>

      {byTransfer && (
        <div className="mt-10">
          <PaymentInstructions bank={getBankDetails()} orderNumber={order.orderNumber} total={order.total} />
        </div>
      )}

      <section className="mt-10 rounded-sheet border border-border bg-surface p-6 shadow-soft">
        <h2 className="mb-5 text-xl">Your order</h2>
        <OrderItemsList items={order.items} />
        <div className="mt-6 border-t border-border pt-5">
          <OrderTotals order={order} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 rounded-sheet border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <h2 className="eyebrow !text-xs">Delivering to</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {a.fullName}
            <br />
            {a.line1}
            {a.line2 ? `, ${a.line2}` : ""}
            <br />
            {a.city}, {a.state}
            <br />
            <span className="font-mono text-sm tabular">{a.phone}</span>
          </address>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="eyebrow !text-xs">Delivery</h2>
            <p className="mt-3 font-medium">{shipping.label}</p>
            <p className="text-sm text-fg-muted">{shipping.description}</p>
          </div>
          <div>
            <h2 className="eyebrow !text-xs">Payment</h2>
            <p className="mt-3 font-medium">{paymentMethods[order.paymentMethod].label}</p>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" endIcon={<ArrowRight className="h-5 w-5" />}>
          <Link href={`/account/orders/${order.orderNumber}`}>Track this order</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
