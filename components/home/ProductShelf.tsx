import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/types/catalog";

/** Heading + products: swipeable row on phones, 4-up grid on desktop. */
export function ProductShelf({
  eyebrow,
  title,
  href,
  hrefLabel = "View all",
  products,
  wishedIds = [],
  authenticated = false,
}: {
  eyebrow: string;
  title: string;
  href: string;
  hrefLabel?: string;
  products: ProductSummary[];
  wishedIds?: string[];
  authenticated?: boolean;
}) {
  const wished = new Set(wishedIds);
  return (
    <section className="section-y !py-10 lg:!py-14" aria-label={title}>
      <div className="container-page">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2">{title}</h2>
          </div>
          <Link href={href} className="shrink-0 text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline">
            {hrefLabel}
          </Link>
        </Reveal>

        <Stagger className="hide-scrollbar -mx-4 flex scroll-px-4 snap-x snap-mandatory sm:scroll-px-6 lg:scroll-px-0 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
          {products.slice(0, 4).map((p) => (
            <StaggerItem key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-auto">
              <ProductCard product={p} wished={wished.has(p.id)} authenticated={authenticated} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
