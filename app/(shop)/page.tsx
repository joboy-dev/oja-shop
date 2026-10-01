import { CategoryRail } from "@/components/home/CategoryRail";
import { Hero } from "@/components/home/Hero";
import { ProductShelf } from "@/components/home/ProductShelf";
import { StoryBand } from "@/components/home/StoryBand";
import { ValueProps } from "@/components/home/ValueProps";
import { getSessionUser } from "@/server/auth/session";
import { getCategories, getFeaturedProducts, getNewArrivals } from "@/server/services/catalog.service";
import { getWishlistIds } from "@/server/services/wishlist.service";

export default async function Home() {
  const [user, categories, featured, newest] = await Promise.all([
    getSessionUser(),
    getCategories(),
    getFeaturedProducts(),
    getNewArrivals(),
  ]);
  const wishedIds = user ? await getWishlistIds(user.id) : [];
  const authenticated = !!user;

  // Hero photos come from live products: a cloth, a ceramic and a basket.
  const pick = (slug: string) => featured.concat(newest).find((p) => p.category.slug === slug)?.image ?? null;
  const heroImages = [pick("textiles"), pick("ceramics"), pick("baskets")];
  const storyImage = categories.find((c) => c.slug === "textiles")?.imageUrl ?? null;

  return (
    <>
      <Hero images={heroImages} />
      <CategoryRail categories={categories} />
      <ProductShelf
        eyebrow="Just in"
        title="New arrivals"
        href="/shop"
        products={newest}
        wishedIds={wishedIds}
        authenticated={authenticated}
      />
      <StoryBand imageUrl={storyImage} />
      <ProductShelf
        eyebrow="Loved by customers"
        title="Best sellers"
        href="/shop?sort=price-desc"
        hrefLabel="Shop all"
        products={featured}
        wishedIds={wishedIds}
        authenticated={authenticated}
      />
      <ValueProps />
    </>
  );
}
