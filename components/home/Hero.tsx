import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Button } from "@/components/ui/Button";
import type { ProductImageDTO } from "@/lib/types/catalog";
import { shopConfig } from "@/lib/config/shop";
import { formatMoney } from "@/lib/utils/money";

const enter = (delay: number) => ({ animationDelay: `${delay}ms` });
const rise = "animate-[pop-in_700ms_var(--ease-snap)_both]";

/** Three photos sit in round "resist" cut-outs on indigo cloth, the way pale motifs sit on an adire throw. */
export function Hero({ images }: { images: (ProductImageDTO | null)[] }) {
  const [a, b, c] = images;
  const circle = "absolute overflow-hidden rounded-full bg-surface-2 shadow-lift";

  return (
    <section className="container-page grid items-center gap-10 pb-12 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
      <div>
        <p className={`eyebrow ${rise}`} style={enter(0)}>
          Handmade in Lagos
        </p>
        <h1 className={`display-hero mt-4 ${rise}`} style={enter(80)}>
          Cloth, clay &amp; cane, made by hand.
        </h1>
        <p className={`mt-6 max-w-lg text-lg text-fg-muted sm:text-xl ${rise}`} style={enter(160)}>
          Adire throws, stoneware, baskets and candles from independent makers across Nigeria. Small batches, honest
          materials, delivered to your door.
        </p>
        <div className={`mt-8 flex flex-wrap gap-3 ${rise}`} style={enter(240)}>
          <Button asChild size="lg" endIcon={<ArrowRight className="h-5 w-5" />}>
            <Link href="/shop">Shop new arrivals</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Meet the makers</Link>
          </Button>
        </div>
        <ul className={`mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted ${rise}`} style={enter(320)}>
          <li>Free delivery over {formatMoney(shopConfig.freeShippingThreshold)}</li>
          <li>Pay on delivery</li>
          <li>7-day returns</li>
        </ul>
      </div>

      <div
        className={`relative isolate aspect-[4/5] w-full overflow-hidden rounded-sheet bg-primary text-on-primary ${rise}`}
        style={enter(120)}
        aria-hidden="true"
      >
        <AdirePattern className="absolute inset-0 opacity-[0.16]" />
        {a && (
          <div className={`${circle} -right-[6%] top-[5%] w-[70%] ring-8 ring-primary/50`}>
            <Image src={a.url} alt="" width={700} height={700} priority fetchPriority="high" sizes="(min-width: 1024px) 34vw, 70vw" className="aspect-square object-cover" />
          </div>
        )}
        {b && (
          <div className={`${circle} bottom-[7%] left-[5%] w-[50%] ring-8 ring-primary/50`}>
            <Image src={b.url} alt="" width={500} height={500} sizes="(min-width: 1024px) 24vw, 50vw" className="aspect-square object-cover" />
          </div>
        )}
        {c && (
          <div className={`${circle} bottom-[16%] right-[9%] w-[27%] ring-4 ring-accent`}>
            <Image src={c.url} alt="" width={300} height={300} sizes="(min-width: 1024px) 13vw, 27vw" className="aspect-square object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
