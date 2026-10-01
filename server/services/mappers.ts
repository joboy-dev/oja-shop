import "server-only";
import type { CategoryDTO, ProductDetail, ProductImageDTO, ProductSummary } from "@/lib/types/catalog";
import type { ProductRow } from "@/server/repositories/product.repo";
import type { CategoryRow } from "@/server/repositories/category.repo";
import { publicUrl } from "@/server/storage/object-storage";

interface ImageSource {
  storageKey: string | null;
  externalUrl: string | null;
}

/** Resolve a stored image reference (bucket key or external URL) to a URL the browser can load. */
export function resolveImageUrl(src: ImageSource): string | null {
  if (src.storageKey) return publicUrl(src.storageKey);
  return src.externalUrl;
}

type ImageRow = ProductRow["images"][number];

function toImage(row: ImageRow): ProductImageDTO | null {
  const url = resolveImageUrl(row);
  return url ? { id: row.id, url, alt: row.alt, width: row.width, height: row.height } : null;
}

const imagesOf = (row: ProductRow) =>
  [...row.images]
    .sort((a, b) => a.position - b.position)
    .map(toImage)
    .filter((i): i is ProductImageDTO => i !== null);

export function toProductSummary(row: ProductRow): ProductSummary {
  const images = imagesOf(row);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    price: row.price,
    compareAtPrice: row.compareAtPrice,
    stock: row.stock,
    isFeatured: row.isFeatured,
    category: { slug: row.category.slug, name: row.category.name },
    image: images[0] ?? null,
    hoverImage: images[1] ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toProductDetail(row: ProductRow): ProductDetail {
  const images = imagesOf(row);
  return {
    ...toProductSummary(row),
    description: row.description,
    materials: row.materials,
    care: row.care,
    isActive: row.isActive,
    images,
  };
}

export function toCategoryDTO(row: CategoryRow): CategoryDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: resolveImageUrl({ storageKey: row.imageStorageKey, externalUrl: row.imageExternalUrl }),
    productCount: row.productCount,
  };
}
