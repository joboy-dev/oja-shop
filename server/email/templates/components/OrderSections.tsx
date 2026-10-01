import { Column, Img, Row, Section, Text } from "@react-email/components";
import { paymentMethods, shippingMethods } from "@/lib/config/shop";
import type { BankDetails, OrderDetailDTO } from "@/lib/types/order";
import { formatMoney } from "@/lib/utils/money";
import { label, mail, Rule } from "./EmailLayout";

export function OrderItemsTable({ order }: { order: OrderDetailDTO }) {
  return (
    <Section>
      {order.items.map((item) => (
        <Row key={item.id} style={{ marginBottom: 14 }}>
          <Column style={{ width: 72, verticalAlign: "top" }}>
            {item.imageUrl ? (
              <Img src={item.imageUrl} width={56} height={70} alt="" style={{ borderRadius: 8, objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: 56, height: 70, borderRadius: 8, backgroundColor: mail.soft }} />
            )}
          </Column>
          <Column style={{ verticalAlign: "top" }}>
            <Text style={{ margin: 0, fontSize: 16, fontWeight: 600, color: mail.ink }}>{item.name}</Text>
            <Text style={{ margin: "2px 0 0", fontSize: 14, color: mail.muted }}>
              {formatMoney(item.unitPrice)} × {item.quantity}
            </Text>
          </Column>
          <Column style={{ width: 110, textAlign: "right", verticalAlign: "top" }}>
            <Text style={{ margin: 0, fontSize: 16, fontWeight: 600, fontFamily: mail.mono, color: mail.ink }}>{formatMoney(item.lineTotal)}</Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

export function OrderTotalsTable({ order }: { order: OrderDetailDTO }) {
  const row = (name: string, value: string, strong = false) => (
    <Row>
      <Column>
        <Text style={{ margin: "4px 0", fontSize: strong ? 18 : 15, fontWeight: strong ? 700 : 400, color: strong ? mail.ink : mail.muted }}>{name}</Text>
      </Column>
      <Column style={{ textAlign: "right" }}>
        <Text style={{ margin: "4px 0", fontSize: strong ? 20 : 15, fontWeight: strong ? 700 : 400, fontFamily: mail.mono, color: mail.ink }}>{value}</Text>
      </Column>
    </Row>
  );
  return (
    <Section>
      {row("Subtotal", formatMoney(order.subtotal))}
      {row("Delivery", order.shippingFee === 0 ? "Free" : formatMoney(order.shippingFee))}
      {order.discount > 0 && row("Discount", `−${formatMoney(order.discount)}`)}
      <Rule />
      {row("Total", formatMoney(order.total), true)}
    </Section>
  );
}

export function DeliveryDetails({ order }: { order: OrderDetailDTO }) {
  const a = order.shippingAddress;
  const shipping = shippingMethods[order.shippingMethod];
  return (
    <Section>
      <Row>
        <Column style={{ width: "50%", verticalAlign: "top" }}>
          <Text style={label}>Delivering to</Text>
          <Text style={{ margin: 0, fontSize: 15, lineHeight: "22px", color: mail.ink }}>
            {a.fullName}
            <br />
            {a.line1}
            {a.line2 ? `, ${a.line2}` : ""}
            <br />
            {a.city}, {a.state}
            <br />
            {a.phone}
          </Text>
        </Column>
        <Column style={{ width: "50%", verticalAlign: "top" }}>
          <Text style={label}>Delivery</Text>
          <Text style={{ margin: "0 0 14px", fontSize: 15, lineHeight: "22px", color: mail.ink }}>
            {shipping.label}
            <br />
            <span style={{ color: mail.muted }}>{shipping.description}</span>
          </Text>
          <Text style={label}>Payment</Text>
          <Text style={{ margin: 0, fontSize: 15, color: mail.ink }}>{paymentMethods[order.paymentMethod].label}</Text>
        </Column>
      </Row>
    </Section>
  );
}

export function BankTransferBox({ order, bank }: { order: OrderDetailDTO; bank: BankDetails | null }) {
  return (
    <Section style={{ backgroundColor: mail.soft, borderRadius: 12, padding: "18px 20px", margin: "0 0 24px" }}>
      <Text style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: mail.ink }}>Pay by bank transfer</Text>
      {bank ? (
        <Text style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: mail.ink }}>
          {bank.bank} · {bank.accountName}
          <br />
          <span style={{ fontFamily: mail.mono, fontSize: 20, fontWeight: 700 }}>{bank.accountNumber}</span>
          <br />
          Amount: <strong>{formatMoney(order.total)}</strong>
          <br />
          <span style={{ color: mail.muted }}>
            Use <strong>{order.orderNumber}</strong> as the reference. We ship as soon as your transfer lands.
          </span>
        </Text>
      ) : (
        <Text style={{ margin: 0, fontSize: 15, lineHeight: "22px", color: mail.muted }}>
          We&apos;ll email you our account details shortly. Please quote <strong style={{ color: mail.ink }}>{order.orderNumber}</strong> as your
          reference.
        </Text>
      )}
    </Section>
  );
}
