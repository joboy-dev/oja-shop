import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { CategoryDTO } from "@/lib/types/catalog";

export function CategoryRail({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="section-y !pt-4" aria-labelledby="cat-heading">
      <div className="container-page">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse</p>
            <h2 id="cat-heading" className="mt-2">
              Shop by category
            </h2>
          </div>
          <Link href="/shop" className="hidden shrink-0 text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline sm:block">
            View everything
          </Link>
        </Reveal>

        <ul className="hide-scrollbar -mx-4 flex scroll-px-4 snap-x snap-mandatory sm:scroll-px-6 lg:scroll-px-0 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
          {categories.map((c, i) => (
            <li key={c.slug} className="w-[68%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
              <Reveal delay={i * 0.05}>
                <Link href={`/shop/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
                  {c.imageUrl && (
                    <Image
                      src={c.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 68vw"
                      className="object-cover transition-transform duration-700 ease-snap group-hover:scale-105"
                    />
                  )}
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <h3 className="font-display text-2xl font-semibold text-white">{c.name}</h3>
                    <span className="font-mono text-sm tabular opacity-90">{c.productCount} pieces</span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
