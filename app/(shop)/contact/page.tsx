import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/ContactForm";
import { PageHeading } from "@/components/layout/PageHeading";
import { siteConfig } from "@/lib/config/site";
import { getSessionUser } from "@/server/auth/session";

export const metadata: Metadata = { title: "Contact", description: "Questions about an order or a piece? Write to us." };

export default async function ContactPage() {
  const user = await getSessionUser();
  const c = siteConfig.contact;
  const details = [
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    { icon: Phone, label: "Phone", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Studio", value: c.city },
    { icon: Clock, label: "Replies", value: "Within one working day" },
  ];
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <PageHeading eyebrow="Contact" title="Talk to a person." intro="Ask about a piece, an order, a custom size or a wholesale enquiry. We read everything." />
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm defaults={{ name: user?.name, email: user?.email }} />
        <aside>
          <ul className="space-y-5 rounded-sheet border border-border bg-surface p-6">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <div>
                  <p className="eyebrow !text-xs">{label}</p>
                  {href ? <a href={href} className="font-medium hover:text-primary">{value}</a> : <p className="font-medium">{value}</p>}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
