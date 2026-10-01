import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <PageHeading eyebrow="Legal" title="Privacy policy" intro="What we collect, why, and who we share it with." />
      <div className="prose-content mt-10">
        <h2>What we collect</h2>
        <ul>
          <li><strong>Account:</strong> your name, email address and profile photo from Google when you sign in. We never see your Google password.</li>
          <li><strong>Orders:</strong> delivery addresses, phone numbers, items ordered and delivery notes.</li>
          <li><strong>Messages:</strong> anything you send through the contact form or newsletter signup.</li>
        </ul>
        <p>We do not collect or store card details. Payment is made on delivery or by bank transfer.</p>

        <h2>How we use it</h2>
        <p>To process and deliver your orders, send order emails, answer your messages and, if you subscribed, tell you about new pieces. We don&apos;t sell your data.</p>

        <h2>Who processes it for us</h2>
        <ul>
          <li>Neon, for our database and image storage.</li>
          <li>Mailgun, to send email.</li>
          <li>Google, for sign-in.</li>
          <li>Delivery partners, who receive only the name, address and phone number needed to deliver.</li>
        </ul>

        <h2>Your choices</h2>
        <p>You can view and edit your addresses in <Link href="/account/addresses">your account</Link>, unsubscribe from the newsletter at any time, and ask us to delete your account and data by writing to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>. Order records may be kept where we are legally required to.</p>

        <h2>Cookies</h2>
        <p>We use a sign-in cookie to keep you signed in, and your browser&apos;s local storage to remember your bag and theme. We don&apos;t use advertising cookies.</p>
      </div>
    </div>
  );
}
