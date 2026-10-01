import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Price, discountPercent } from "@/components/ui/Price";
import type { ProductSummary } from "@/lib/types/catalog";
import { QuickAddButton } from "./QuickAddButton";
import { WishlistButton } from "./WishlistButton";

const sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

export function ProductCard({
  product,
  wished = false,
  authenticated = false,
  priority = false,
  headingLevel = 3,
}: {
  product: ProductSummary;
  wished?: boolean;
  authenticated?: boolean;
  priority?: boolean;
  /** Use 2 when the card list sits directly under the page's h1 (no h2 between). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const soldOut = product.stock <= 0;
  const percent = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface-2">
        {product.image && (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            className="object-cover transition-transform duration-700 ease-snap group-hover:scale-[1.04]"
          />
        )}
        {product.hoverImage && (
          <Image
            src={product.hoverImage.url}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <Badge tone="neutral" className="bg-surface/90 backdrop-blur">
              Sold out
            </Badge>
          ) : (
            percent > 0 && <Badge tone="accent">−{percent}%</Badge>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          productName={product.name}
          wished={wished}
          authenticated={authenticated}
          className="absolute right-3 top-3 z-10"
        />
        {!soldOut && (
          <QuickAddButton
            className="absolute bottom-3 right-3 z-10"
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: product.image?.url ?? null,
              imageAlt: product.image?.alt ?? product.name,
              price: product.price,
              stock: product.stock,
            }}
          />
        )}
        {soldOut && <div aria-hidden="true" className="absolute inset-0 bg-background/40" />}
      </div>

      <div className="mt-3.5 space-y-1">
        <p className="eyebrow">{product.category.name}</p>
        <Heading className="text-base font-medium leading-snug">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-primary">
            {product.name}
          </Link>
        </Heading>
        <Price kobo={product.price} compareAt={product.compareAtPrice} size="sm" />
      </div>
    </article>
  );
}
