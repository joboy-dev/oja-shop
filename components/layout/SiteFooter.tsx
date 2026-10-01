import Link from "next/link";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/config/site";
import { NewsletterForm } from "./NewsletterForm";

function Column({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow !font-mono !text-xs">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-0.5 text-[0.9375rem] transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div aria-hidden="true" className="h-6 overflow-hidden bg-primary text-on-primary">
        <AdirePattern className="opacity-30" />
      </div>
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-fg-muted">{siteConfig.description}</p>
          <div>
            <p className="mb-2.5 text-sm font-medium">New pieces, once a month. No spam.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <Column title="Shop" links={siteConfig.footer.shop} />
          <Column title="Help" links={siteConfig.footer.help} />
          <Column title="Company" links={siteConfig.footer.company} />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Made with care in {siteConfig.contact.city}.
          </p>
          <p>Pay on delivery or by bank transfer · Delivery across Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
