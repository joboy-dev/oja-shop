import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { shippingMethods, shopConfig } from "@/lib/config/shop";
import { formatMoney } from "@/lib/utils/money";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingReturnsPage() {
  const s = shippingMethods.standard;
  const e = shippingMethods.express;
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <PageHeading eyebrow="Help" title="Shipping & returns" />
      <div className="prose-content mt-10">
        <h2>Delivery</h2>
        <p>We deliver across Nigeria. Orders are packed by hand and normally leave our studio within one working day of being confirmed.</p>
        <ul>
          <li><strong>{s.label}</strong>, {formatMoney(s.fee)}. {s.description}. Free on orders over {formatMoney(shopConfig.freeShippingThreshold)}.</li>
          <li><strong>{e.label}</strong>, {formatMoney(e.fee)}. {e.description}.</li>
        </ul>
        <p>You&apos;ll get an email when your order ships, and you can follow it under <Link href="/account/orders">your orders</Link>.</p>

        <h2>Payment</h2>
        <p>Pay on delivery, or by bank transfer. For transfers, use your order number as the reference; we ship as soon as the payment arrives.</p>

        <h2>Returns</h2>
        <p>If something isn&apos;t right, you can return it within 7 days of delivery for a refund or exchange, provided it is unused and in its original packaging.</p>
        <ol>
          <li><Link href="/contact">Contact us</Link> with your order number and the item you&apos;d like to return.</li>
          <li>We&apos;ll arrange collection or tell you where to send it.</li>
          <li>Once it reaches us and passes a quick check, we refund or exchange within 5 working days.</li>
        </ol>
        <p>Because pieces are handmade, small variations in colour, pattern and glaze are normal and aren&apos;t a reason for return. Damaged or incorrect items are always replaced at our cost.</p>
      </div>
    </div>
  );
}
