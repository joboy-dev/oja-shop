import { Text } from "@react-email/components";
import { orderStatusLabels, type OrderStatus } from "@/lib/config/shop";
import type { OrderDetailDTO } from "@/lib/types/order";
import { CtaButton, EmailLayout, h1, mail, p, Rule } from "./components/EmailLayout";
import { OrderItemsTable } from "./components/OrderSections";

const copy: Record<OrderStatus, { title: string; body: string }> = {
  pending: { title: "We've received your order", body: "We'll confirm it shortly." },
  confirmed: { title: "Your order is confirmed", body: "We're getting it ready." },
  processing: { title: "We're preparing your order", body: "Your pieces are being checked and packed." },
  shipped: { title: "Your order is on its way", body: "It has left our studio and is heading to you." },
  delivered: { title: "Your order has been delivered", body: "We hope you love it. If anything isn't right, reply to this email within 7 days." },
  cancelled: { title: "Your order was cancelled", body: "If you didn't ask for this, or you have questions, just reply to this email." },
};

export function OrderStatusUpdate({ order, status, note, firstName, appUrl }: { order: OrderDetailDTO; status: OrderStatus; note?: string | null; firstName: string; appUrl: string }) {
  const { title, body } = copy[status];
  return (
    <EmailLayout appUrl={appUrl} preview={`${title}: ${order.orderNumber}`}>
      <Text style={h1}>{title}</Text>
      <Text style={p}>
        Hi {firstName}. {body} Order <strong style={{ fontFamily: mail.mono, color: mail.ink, whiteSpace: "nowrap" }}>{order.orderNumber}</strong> is now{" "}
        <strong style={{ color: mail.ink }}>{orderStatusLabels[status].toLowerCase()}</strong>.
      </Text>
      {note && (
        <Text style={{ ...p, backgroundColor: mail.soft, borderRadius: 12, padding: "14px 16px", color: mail.ink }}>{note}</Text>
      )}
      <OrderItemsTable order={order} />
      <Rule />
      <CtaButton href={`${appUrl}/account/orders/${order.orderNumber}`}>Track your order</CtaButton>
    </EmailLayout>
  );
}
