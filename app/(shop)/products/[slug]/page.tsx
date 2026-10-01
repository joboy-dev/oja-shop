import { RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { StockBadge } from "@/components/product/StockBadge";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Price, discountPercent } from "@/components/ui/Price";
import { Tabs } from "@/components/ui/Tabs";
import { publicEnv } from "@/lib/config/public-env";
import { shippingMethods, shopConfig } from "@/lib/config/shop";
import { formatMoney } from "@/lib/utils/money";
import { getSessionUser } from "@/server/auth/session";
import { getProduct, getRelatedProducts } from "@/server/services/catalog.service";
import { getWishlistIds } from "@/server/services/wishlist.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription, images: product.image ? [product.image.url] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [user, related] = await Promise.all([getSessionUser(), getRelatedProducts(product.category.slug, product.id)]);
  const wishedIds = user ? await getWishlistIds(user.id) : [];
  const percent = discountPercent(product.price, product.compareAtPrice);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    category: product.category.name,
    url: `${publicEnv.appUrl}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page pb-8 pt-6 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category.name, href: `/shop/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="min-w-0 lg:pt-2">
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="mt-2">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Price kobo={product.price} compareAt={product.compareAtPrice} size="xl" />
            {percent > 0 && <Badge tone="accent">Save {percent}%</Badge>}
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-5 text-lg text-fg-muted">{product.shortDescription}</p>

          <div className="mt-8">
            <ProductPurchase
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: product.image?.url ?? null,
                imageAlt: product.image?.alt ?? product.name,
                price: product.price,
                stock: product.stock,
              }}
              compareAt={product.compareAtPrice}
              wished={wishedIds.includes(product.id)}
              authenticated={!!user}
            />
          </div>

          <ul className="mt-8 space-y-3 rounded-card border border-border bg-surface p-4 text-[0.9375rem]">
            <li className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="font-medium">Delivery across Nigeria.</strong>{" "}
                <span className="text-fg-muted">
                  {shippingMethods.standard.description}. Free standard delivery over{" "}
                  <span className="font-mono tabular">{formatMoney(shopConfig.freeShippingThreshold)}</span>.
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="font-medium">7-day returns.</strong>{" "}
                <span className="text-fg-muted">If it&apos;s unused and in its packaging, we&apos;ll take it back.</span>
              </span>
            </li>
          </ul>

          <Tabs
            className="mt-10"
            tabs={[
              { value: "details", label: "Details", content: <p className="whitespace-pre-line text-fg-muted">{product.description}</p> },
              {
                value: "care",
                label: "Materials & care",
                content: (
                  <dl className="space-y-4 text-fg-muted">
                    {product.materials && (
                      <div>
                        <dt className="font-medium text-fg">Materials</dt>
                        <dd>{product.materials}</dd>
                      </div>
                    )}
                    {product.care && (
                      <div>
                        <dt className="font-medium text-fg">Care</dt>
                        <dd>{product.care}</dd>
                      </div>
                    )}
                    {!product.materials && !product.care && <p>No care notes for this piece.</p>}
                  </dl>
                ),
              },
              {
                value: "delivery",
                label: "Delivery & returns",
                content: (
                  <div className="space-y-3 text-fg-muted">
                    <p>
                      Standard: {shippingMethods.standard.description} ({formatMoney(shippingMethods.standard.fee)}).
                    </p>
                    <p>
                      Express: {shippingMethods.express.description} ({formatMoney(shippingMethods.express.fee)}).
                    </p>
                    <p>Return unused items within 7 days of delivery for a refund or exchange.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6">
            You may also like
          </h2>
          <ProductGrid products={related} wishedIds={wishedIds} authenticated={!!user} />
        </section>
      )}
    </div>
  );
}
