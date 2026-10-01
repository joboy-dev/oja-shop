import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/config/public-env";
import { getCategories, getSitemapProducts } from "@/server/services/catalog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.appUrl.replace(/\/$/, "");
  const [categories, products] = await Promise.all([getCategories(), getSitemapProducts()]);
  const staticPaths = ["", "/shop", "/about", "/contact", "/faq", "/shipping-returns", "/privacy", "/terms"];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${base}/shop/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
