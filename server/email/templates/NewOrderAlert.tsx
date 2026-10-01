import { Text } from "@react-email/components";
import type { OrderDetailDTO } from "@/lib/types/order";
import { formatMoney } from "@/lib/utils/money";
import { CtaButton, EmailLayout, h1, mail, p, Rule } from "./components/EmailLayout";
import { DeliveryDetails, OrderItemsTable } from "./components/OrderSections";

export function NewOrderAlert({ order, appUrl }: { order: OrderDetailDTO; appUrl: string }) {
  return (
    <EmailLayout appUrl={appUrl} preview={`New order ${order.orderNumber}: ${formatMoney(order.total)}`}>
      <Text style={h1}>New order {order.orderNumber}</Text>
      <Text style={p}>
        {order.email} · <strong style={{ color: mail.ink }}>{formatMoney(order.total)}</strong> ·{" "}
        {order.paymentMethod === "bank_transfer" ? "awaiting bank transfer" : "pay on delivery"}
      </Text>
      <OrderItemsTable order={order} />
      <Rule />
      <DeliveryDetails order={order} />
      {order.notes && (
        <>
          <Rule />
          <Text style={{ ...p, color: mail.ink }}>
            <strong>Customer note:</strong> {order.notes}
          </Text>
        </>
      )}
      <Rule />
      <CtaButton href={`${appUrl}/admin/orders/${order.orderNumber}`}>Open in admin</CtaButton>
    </EmailLayout>
  );
}
