import { route } from "../_lib/handler";
import { getCategories, getFeaturedProducts, getNewArrivals } from "@/server/services/catalog.service";

/** Everything the mobile Home screen needs in one round trip. */
export const GET = route({ cache: "public" }, async () => {
  const [categories, featured, newest] = await Promise.all([getCategories(), getFeaturedProducts(), getNewArrivals()]);

  // Same picks as the web home page: a cloth, a ceramic and a basket for the hero.
  const pick = (slug: string) => featured.concat(newest).find((p) => p.category.slug === slug)?.image ?? null;

  return {
    categories,
    featured,
    newest,
    heroImages: [pick("textiles"), pick("ceramics"), pick("baskets")],
    storyImageUrl: categories.find((c) => c.slug === "textiles")?.imageUrl ?? null,
  };
});
