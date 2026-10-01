import { eq, inArray, isNotNull, and } from "drizzle-orm";
import { db, schema } from "@/server/db/client";
import { seedCategories } from "./data/categories";
import { seedProducts } from "./data/products";

/**
 * Idempotent: safe to re-run. Upserts by slug and replaces seeded (external) product images.
 * Images uploaded through the admin (storage_key) are never touched.
 */
async function main() {
  console.log("Seeding categories…");
  for (const c of seedCategories) {
    await db
      .insert(schema.categories)
      .values(c)
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          name: c.name,
          description: c.description,
          imageExternalUrl: c.imageExternalUrl,
          sortOrder: c.sortOrder,
        },
      });
  }

  const cats = await db.select({ id: schema.categories.id, slug: schema.categories.slug }).from(schema.categories);
  const categoryId = new Map(cats.map((c) => [c.slug, c.id]));

  console.log("Seeding products…");
  const seededIds: string[] = [];
  // Interleave categories by age so "new arrivals" shows a mix, not one category.
  const perCategory = new Map<string, number>();
  const catOrder = seedCategories.map((c) => c.slug as string);
  const ranks = new Map(
    seedProducts.map((p) => {
      const nth = perCategory.get(p.category) ?? 0;
      perCategory.set(p.category, nth + 1);
      return [p.slug, nth * catOrder.length + catOrder.indexOf(p.category)] as const;
    }),
  );
  const now = Date.now();
  for (const p of seedProducts) {
    const catId = categoryId.get(p.category);
    if (!catId) throw new Error(`Unknown category ${p.category} for ${p.slug}`);

    const values = {
      slug: p.slug,
      name: p.name,
      shortDescription: p.short,
      description: p.description,
      price: Math.round(p.priceNaira * 100),
      compareAtPrice: p.compareAtNaira ? Math.round(p.compareAtNaira * 100) : null,
      stock: p.stock,
      categoryId: catId,
      isActive: true,
      isFeatured: p.featured ?? false,
      materials: p.materials,
      care: p.care,
      createdAt: new Date(now - (seedProducts.length - (ranks.get(p.slug) ?? 0)) * 36 * 3_600_000),
    };
    const [row] = await db
      .insert(schema.products)
      .values(values)
      .onConflictDoUpdate({ target: schema.products.slug, set: values })
      .returning({ id: schema.products.id });
    seededIds.push(row.id);

    await db
      .delete(schema.productImages)
      .where(and(eq(schema.productImages.productId, row.id), isNotNull(schema.productImages.externalUrl)));
    await db.insert(schema.productImages).values(
      p.images.map((image, position) => ({
        productId: row.id,
        externalUrl: image.url,
        alt: image.alt,
        position,
        width: 1200,
        height: 1500,
      })),
    );
  }

  const count = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(inArray(schema.products.id, seededIds));
  console.log(`Done: ${seedCategories.length} categories, ${count.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
