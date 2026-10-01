import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function StoryBand({ imageUrl }: { imageUrl: string | null }) {
  return (
    <section className="relative isolate my-10 overflow-hidden bg-primary text-on-primary lg:my-16">
      <AdirePattern className="absolute inset-0 -z-10 opacity-[0.1]" />
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <Reveal>
          <p className="eyebrow !text-on-primary/70">Our makers</p>
          <h2 className="mt-3 !text-on-primary">Every piece has a name behind it.</h2>
          <p className="mt-5 max-w-lg text-lg text-on-primary/85">
            We work with dyers in Abeokuta, potters in Ibadan and basket weavers in Kano. They set their own prices, make
            in batches small enough to do properly, and we photograph every piece ourselves so what arrives looks like what
            you ordered.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-8" endIcon={<ArrowRight className="h-5 w-5" />}>
            <Link href="/about">Read our story</Link>
          </Button>
        </Reveal>
        <Reveal delay={0.1} className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-sheet bg-surface-2 shadow-overlay">
          {imageUrl && <Image src={imageUrl} alt="Hand-dyed indigo cloth with pale circular motifs" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />}
        </Reveal>
      </div>
    </section>
  );
}
