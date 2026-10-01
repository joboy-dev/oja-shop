import { Text } from "@react-email/components";
import type { BankDetails, OrderDetailDTO } from "@/lib/types/order";
import { CtaButton, EmailLayout, h1, mail, p, Rule } from "./components/EmailLayout";
import { BankTransferBox, DeliveryDetails, OrderItemsTable, OrderTotalsTable } from "./components/OrderSections";

export interface OrderConfirmationProps {
  order: OrderDetailDTO;
  firstName: string;
  bank: BankDetails | null;
  appUrl: string;
}

export function OrderConfirmation({ order, firstName, bank, appUrl }: OrderConfirmationProps) {
  return (
    <EmailLayout appUrl={appUrl} preview={`Order ${order.orderNumber} is confirmed. Thank you, ${firstName}.`}>
      <Text style={h1}>Thank you, {firstName}.</Text>
      <Text style={p}>
        We&apos;ve got your order and we&apos;re getting it ready. Your order number is{" "}
        <strong style={{ fontFamily: mail.mono, color: mail.ink, whiteSpace: "nowrap" }}>{order.orderNumber}</strong>.
      </Text>
      {order.paymentMethod === "bank_transfer" && <BankTransferBox order={order} bank={bank} />}
      <OrderItemsTable order={order} />
      <Rule />
      <OrderTotalsTable order={order} />
      <Rule />
      <DeliveryDetails order={order} />
      <Rule />
      <CtaButton href={`${appUrl}/account/orders/${order.orderNumber}`}>View your order</CtaButton>
      <Text style={{ ...p, margin: "20px 0 0", fontSize: 14 }}>Questions? Just reply to this email and quote {order.orderNumber}.</Text>
    </EmailLayout>
  );
}
