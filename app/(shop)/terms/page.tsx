import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <PageHeading eyebrow="Legal" title="Terms of service" intro="The short version of how buying from Ọjà works." />
      <div className="prose-content mt-10">
        <h2>Orders</h2>
        <p>When you place an order we send a confirmation email. That confirms we&apos;ve received it; the order is accepted once we confirm the items are available. If something sells out before we can pack it, we&apos;ll tell you and refund anything you&apos;ve paid.</p>

        <h2>Prices</h2>
        <p>Prices are in Nigerian naira and include no hidden fees. Delivery is shown at checkout before you place your order. We may change prices at any time, but never for an order already placed.</p>

        <h2>Payment</h2>
        <p>You can pay on delivery or by bank transfer. Orders paid by transfer ship once payment is received. Quote your order number as the transfer reference.</p>

        <h2>Delivery and returns</h2>
        <p>Delivery times are estimates. Our <Link href="/shipping-returns">shipping and returns policy</Link> forms part of these terms.</p>

        <h2>Handmade goods</h2>
        <p>Our products are made by hand, so size, colour and pattern vary slightly between pieces. Photographs are as accurate as we can make them, but the piece you receive will not be identical.</p>

        <h2>Your account</h2>
        <p>You sign in with Google and are responsible for activity on your account. We may suspend accounts used for fraud or abuse.</p>

        <h2>Contact</h2>
        <p>Questions about these terms? <Link href="/contact">Get in touch</Link>.</p>
      </div>
    </div>
  );
}
