import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { Accordion } from "@/components/ui/Accordion";
import { shippingMethods, shopConfig } from "@/lib/config/shop";
import { formatMoney } from "@/lib/utils/money";

export const metadata: Metadata = { title: "FAQ", description: "Delivery, payment, returns and care: the questions we get asked most." };

const items = [
  { value: "delivery-time", title: "How long does delivery take?", content: `${shippingMethods.standard.description}. Express is ${shippingMethods.express.description.toLowerCase()}.` },
  { value: "delivery-cost", title: "How much is delivery?", content: `Standard is ${formatMoney(shippingMethods.standard.fee)} and free on orders over ${formatMoney(shopConfig.freeShippingThreshold)}. Express is ${formatMoney(shippingMethods.express.fee)}.` },
  { value: "payment", title: "How do I pay?", content: "Choose pay on delivery (cash or transfer when your order arrives) or bank transfer. If you pick transfer we show our account details straight after checkout and ship once the payment lands." },
  { value: "sign-in", title: "Why do I need to sign in with Google?", content: "It confirms your email so we can send your order details, and it lets you track orders and save addresses. We only receive your name, email and profile photo." },
  { value: "returns", title: "Can I return something?", content: "Yes. Unused items in their packaging can be returned within 7 days of delivery for a refund or exchange. Contact us with your order number and we'll arrange collection." },
  { value: "variation", title: "Will my piece look exactly like the photo?", content: "Close, but not identical. Hand-dyed and hand-thrown pieces vary slightly in pattern, colour and glaze. That variation is part of what you're buying." },
  { value: "care", title: "How do I look after my pieces?", content: "Every product page has care notes under 'Materials & care'. As a rule: wash indigo cloth by hand in cool water, and keep wicker dry." },
  { value: "stock", title: "Why is something sold out?", content: "Makers produce in small batches. Sold-out pieces return when the next batch is finished. Subscribe to our newsletter to hear first." },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.title, acceptedAnswer: { "@type": "Answer", text: i.content } })),
  };
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeading eyebrow="Help" title="Frequently asked questions" />
      <div className="mt-10 max-w-3xl">
        <Accordion items={items} />
      </div>
    </div>
  );
}
