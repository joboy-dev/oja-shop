import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { PageHeading } from "@/components/layout/PageHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About", description: "Who makes the things we sell, and why we keep the batches small." };

const values = [
  { title: "Small batches", text: "A dyer can do one vat properly in a day. We buy what a maker can finish with care, and we stop there." },
  { title: "Fair prices", text: "Makers set their own prices. We add a flat margin for photography, packing and delivery, and we show you the maths on request." },
  { title: "Honest photos", text: "We photograph every piece ourselves, in daylight, so what arrives looks like what you ordered." },
];

export default function AboutPage() {
  return (
    <div className="container-page pb-8 pt-8 sm:pt-14">
      <PageHeading eyebrow="About Ọjà" title="A market, made small." intro="Ọjà means market in Yoruba. We started with one question: why is it still so hard to buy beautiful, well-made things from the people who make them?" />

      <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-sheet bg-surface-2">
        <Image
          src="https://images.unsplash.com/photo-1558703374-f9a51255e1cc?auto=format&fit=crop&w=1800&h=1000&q=80"
          alt="Indigo-dyed cloths hanging to dry between buildings"
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal><h2>Where it comes from</h2></Reveal>
        <Reveal delay={0.05} className="prose-content">
          <p>
            We work with dyers in Abeokuta who still paint adire eleko by hand in cassava paste, potters in Ibadan who fire stoneware in small
            batches, and basket weavers in Kano whose patterns have been passed down for generations. Candles and body care come from small
            producers who would rather make fewer things and make them well.
          </p>
          <p>
            Ọjà is how their work reaches people in Lagos, Abuja, Port Harcourt and everywhere else in Nigeria, without a middleman taking most
            of the price.
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <Reveal key={v.title} as="li" delay={i * 0.06} className="rounded-card border border-border bg-surface p-6">
            <h3>{v.title}</h3>
            <p className="mt-2 text-fg-muted">{v.text}</p>
          </Reveal>
        ))}
      </ul>

      <section className="relative isolate mt-16 overflow-hidden rounded-sheet bg-primary px-6 py-14 text-center text-on-primary sm:px-12">
        <AdirePattern className="absolute inset-0 -z-10 opacity-[0.12]" />
        <h2 className="!text-on-primary">See what&apos;s new</h2>
        <p className="mx-auto mt-3 max-w-md text-on-primary/85">Every piece in the shop has a maker behind it.</p>
        <Button asChild variant="accent" size="lg" className="mt-7" endIcon={<ArrowRight className="h-5 w-5" />}>
          <Link href="/shop">Shop the collection</Link>
        </Button>
      </section>
    </div>
  );
}
