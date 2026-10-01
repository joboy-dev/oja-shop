"use client";

import { Bell, Heart, Search, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Reveal } from "@/components/motion/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button, IconButton } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Kbd } from "@/components/ui/Kbd";
import { Pagination } from "@/components/ui/Pagination";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { RadioCard, RadioCardGroup } from "@/components/ui/RadioCard";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { Tabs } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";
import { Avatar } from "@/components/ui/Avatar";

const swatches = [
  ["background", "bg-background"], ["surface", "bg-surface"], ["surface-2", "bg-surface-2"], ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"], ["border", "bg-border"], ["primary", "bg-primary"], ["primary-soft", "bg-primary-soft"],
  ["accent", "bg-accent"], ["success", "bg-success"], ["danger", "bg-danger"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="mb-6 text-2xl">{title}</h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

export function UiShowcase() {
  const [qty, setQty] = useState(2);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [delivery, setDelivery] = useState("standard");
  const [state, setState] = useState("lagos");

  return (
    <main className="container-page pb-24 pt-8">
      <header className="mb-8 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      <p className="eyebrow mb-3">Design system</p>
      <h1 className="display-hero mb-4">Indigo vat</h1>
      <p className="mb-10 max-w-xl text-lg text-fg-muted">
        Every primitive, in both themes. If something looks off here it will look off everywhere.
      </p>

      <Section title="Colour">
        {swatches.map(([name, cls]) => (
          <div key={name} className="w-28">
            <div className={`h-16 rounded-control border border-border ${cls}`} />
            <p className="mt-1.5 font-mono text-xs text-fg-muted">{name}</p>
          </div>
        ))}
      </Section>

      <Section title="Type">
        <div className="space-y-3">
          <h1>Heading one — handmade in Lagos</h1>
          <h2>Heading two — adire throws</h2>
          <h3>Heading three — speckled stoneware</h3>
          <p className="max-w-prose">
            Body copy in Instrument Sans at 16px with a 1.55 line height. Ọjà means market in Yoruba. The
            quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-mono text-sm tabular">₦48,000 · OJ-7K2F9Q · 0123456789</p>
        </div>
      </Section>

      <Section title="Buttons">
        <Button>Add to bag</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="accent">Sale</Button>
        <Button variant="danger" startIcon={<Trash2 className="h-4 w-4" />}>Remove</Button>
        <Button variant="link">Link style</Button>
        <Button size="sm">Small</Button>
        <Button size="lg" endIcon={<ShoppingBag className="h-5 w-5" />}>Large</Button>
        <Button disabled>Disabled</Button>
        <Button
          isLoading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1600);
          }}
        >
          Place order
        </Button>
        <IconButton label="Search"><Search className="h-5 w-5" /></IconButton>
        <IconButton label="Wishlist" variant="outline"><Heart className="h-5 w-5" /></IconButton>
      </Section>

      <Section title="Form controls">
        <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
          <Field label="Full name" required><Input placeholder="Adaeze Okafor" /></Field>
          <Field label="Email" error="Enter a valid email address"><Input defaultValue="adaeze@" /></Field>
          <Field label="Phone" hint="We call only about your delivery."><Input inputMode="tel" placeholder="0803 000 0000" /></Field>
          <Field label="State">
            <Select
              value={state}
              onValueChange={setState}
              options={[{ value: "lagos", label: "Lagos" }, { value: "oyo", label: "Oyo" }, { value: "fct", label: "FCT Abuja" }]}
            />
          </Field>
          <Field label="Delivery notes" className="sm:col-span-2"><Textarea placeholder="Gate code, landmarks…" /></Field>
          <Checkbox label="Save this address" description="Use it again next time." defaultChecked />
          <Switch label="Email me order updates" defaultChecked />
        </div>
        <RadioCardGroup value={delivery} onValueChange={setDelivery} className="w-full max-w-xl">
          <RadioCard value="standard" title="Standard delivery" description="3–5 working days" aside="₦3,500" />
          <RadioCard value="express" title="Express delivery" description="Next working day in Lagos" aside="₦7,500" />
        </RadioCardGroup>
      </Section>

      <Section title="Display">
        <Badge>Neutral</Badge><Badge tone="primary">New</Badge><Badge tone="accent">-13%</Badge>
        <Badge tone="success">In stock</Badge><Badge tone="danger">Sold out</Badge><Badge tone="outline">Handmade</Badge>
        <Price kobo={4_800_000} compareAt={5_500_000} size="lg" />
        <QuantityStepper value={qty} onChange={setQty} />
        <Kbd>⌘</Kbd><Kbd>K</Kbd>
        <Avatar name="Adaeze Okafor" /><Avatar name="Tunde" size="lg" />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Textiles", href: "/shop/textiles" }, { label: "Adire Eleko Throw" }]} />
      </Section>

      <Section title="Overlays">
        <Dialog>
          <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
          <DialogContent title="Remove address?" description="This address will no longer be available at checkout.">
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost">Keep it</Button>
              <Button variant="danger">Remove</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={() => setSheet(true)}>Open sheet</Button>
        <Sheet
          open={sheet}
          onOpenChange={setSheet}
          title="Your bag"
          description="2 items"
          footer={<Button className="w-full" size="lg">Checkout · ₦48,000</Button>}
        >
          <div className="space-y-3 pt-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-card border border-border p-3">
                <Skeleton className="h-16 w-14" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></div>
              </div>
            ))}
          </div>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Signed in as Adaeze</DropdownMenuLabel>
            <DropdownMenuItem>My orders</DropdownMenuItem>
            <DropdownMenuItem>Addresses</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip content="Notifications"><IconButton label="Notifications"><Bell className="h-5 w-5" /></IconButton></Tooltip>
        <Button variant="secondary" onClick={() => toast.success("Added to your bag", { description: "Adire Eleko Throw" })}>Success toast</Button>
        <Button variant="secondary" onClick={() => toast.error("Only 2 left — we updated your bag")}>Error toast</Button>
        <Button variant="secondary" onClick={() => toast("Removed from bag", { action: { label: "Undo", onClick: () => {} } })}>Undo toast</Button>
      </Section>

      <Section title="Tabs & accordion">
        <div className="w-full max-w-2xl space-y-8">
          <Tabs tabs={[
            { value: "details", label: "Details", content: <p className="text-fg-muted">Hand-painted cassava-paste resist on deep indigo cotton.</p> },
            { value: "care", label: "Materials & care", content: <p className="text-fg-muted">Cool hand wash, dry in shade.</p> },
            { value: "delivery", label: "Delivery & returns", content: <p className="text-fg-muted">3–5 working days. 7-day returns.</p> },
          ]} />
          <Accordion defaultValue="a" items={[
            { value: "a", title: "How long does delivery take?", content: "3–5 working days nationwide, 1–2 in Lagos." },
            { value: "b", title: "Can I return an item?", content: "Yes, within 7 days if it is unused." },
          ]} />
        </div>
      </Section>

      <Section title="Loading, empty, pagination">
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}><Skeleton className="aspect-[4/5] w-full rounded-card" /><Skeleton className="mt-3 h-4 w-3/4" /><Skeleton className="mt-2 h-4 w-1/3" /></div>
          ))}
        </div>
        <EmptyState className="w-full max-w-xl" icon={ShoppingBag} title="Your bag is empty" description="Start with our new adire throws." action={<Button>Browse the shop</Button>} />
        <div className="w-full"><Pagination page={4} totalPages={12} buildHref={(p) => `?page=${p}`} /></div>
      </Section>

      <Section title="Signature pattern">
        <Reveal className="relative h-64 w-full overflow-hidden rounded-sheet bg-primary text-on-primary">
          <AdirePattern className="absolute inset-0 opacity-25" />
          <div className="absolute inset-0 grid place-items-center"><span className="display-hero">Ọjà</span></div>
        </Reveal>
      </Section>
    </main>
  );
}
