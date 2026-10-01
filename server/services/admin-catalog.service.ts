import "server-only";
import { shopConfig } from "@/lib/config/shop";
import type { AdminCategory, AdminProductDetail, AdminProductRow } from "@/lib/types/admin";
import type { Paginated } from "@/lib/types/catalog";
import { slugify } from "@/lib/utils/slug";
import type { CategoryFormValues, ProductFormValues } from "@/lib/validators/admin";
import { withTransaction } from "@/server/db/client";
import * as repo from "@/server/repositories/admin-catalog.repo";
import type { AdminProductFilters } from "@/server/repositories/admin-catalog.repo";
import * as categoryRepo from "@/server/repositories/category.repo";
import { ServiceError } from "./errors";
import { resolveImageUrl } from "./mappers";
import * as media from "./media.service";

const sortedImages = <T extends { position: number }>(images: T[]) => [...images].sort((a, b) => a.position - b.position);

export async function listProducts(filters: AdminProductFilters): Promise<Paginated<AdminProductRow>> {
  const { rows, total } = await repo.listAdminProducts(filters);
  return {
    items: rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categoryName: p.category.name,
      price: p.price,
      stock: p.stock,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      imageUrl: resolveImageUrl(sortedImages(p.images)[0] ?? { storageKey: null, externalUrl: null }),
      updatedAt: p.updatedAt.toISOString(),
    })),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
  };
}

export async function getProductForEdit(id: string): Promise<AdminProductDetail | null> {
  const p = await repo.getAdminProduct(id);
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    materials: p.materials,
    care: p.care,
    images: sortedImages(p.images).flatMap((i) => {
      const url = resolveImageUrl(i);
      return url ? [{ id: i.id, url, alt: i.alt }] : [];
    }),
  };
}

export const getCategoryOptions = () => repo.listCategoryOptions();

export async function saveProduct(productId: string | undefined, v: ProductFormValues): Promise<{ id: string; slug: string }> {
  const slug = v.slug || slugify(v.name);
  if (!slug) throw new ServiceError("Add a name so we can make a URL for this product.", { name: ["Enter a product name"] });
  if (await repo.productSlugTaken(slug, productId)) {
    throw new ServiceError("Another product already uses that URL.", { slug: ["That URL is taken. Change it slightly."] });
  }

  // Network checks happen before the transaction so it stays short.
  const uploadIds = v.images.flatMap((i) => (i.uploadId ? [i.uploadId] : []));
  const verified = await media.verifyUploads(uploadIds);

  const values = {
    slug,
    name: v.name,
    shortDescription: v.shortDescription,
    description: v.description,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    stock: v.stock,
    categoryId: v.categoryId,
    isActive: v.isActive,
    isFeatured: v.isFeatured,
    materials: v.materials || null,
    care: v.care || null,
  };

  const result = await withTransaction(async (tx) => {
    const row = productId ? await repo.updateProduct(productId, values, tx) : await repo.insertProduct(values, tx);
    if (!row) throw new ServiceError("That product no longer exists.");
    const removedKeys = await repo.syncProductImages(
      row.id,
      v.images.map((img, position) => ({
        imageId: img.imageId,
        storageKey: img.uploadId ? verified.get(img.uploadId)?.key : undefined,
        alt: img.alt,
        position,
      })),
      tx,
    );
    await media.markAttached(verified, tx);
    return { id: row.id, slug: row.slug, removedKeys };
  });

  void media.deleteUnreferencedObjects(result.removedKeys);
  return { id: result.id, slug: result.slug };
}

export async function deleteProduct(id: string): Promise<{ slug: string }> {
  const product = await repo.getAdminProduct(id);
  if (!product) throw new ServiceError("That product no longer exists.");
  const keys = await repo.productImageKeys(id);
  await repo.deleteProduct(id);
  void media.deleteUnreferencedObjects(keys);
  return { slug: product.slug };
}

export async function setProductActive(id: string, isActive: boolean): Promise<{ slug: string }> {
  const row = await repo.setProductActive(id, isActive);
  if (!row) throw new ServiceError("That product no longer exists.");
  return row;
}

// ── categories ─────────────────────────────────────────────────────
export async function listCategories(): Promise<AdminCategory[]> {
  return (await categoryRepo.listCategories()).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    imageUrl: resolveImageUrl({ storageKey: c.imageStorageKey, externalUrl: c.imageExternalUrl }),
    sortOrder: c.sortOrder,
    productCount: c.productCount,
  }));
}

export async function saveCategory(categoryId: string | undefined, v: CategoryFormValues): Promise<void> {
  const slug = v.slug || slugify(v.name);
  if (await repo.categorySlugTaken(slug, categoryId)) {
    throw new ServiceError("Another category already uses that URL.", { slug: ["That URL is taken."] });
  }
  const verified = await media.verifyUploads(v.uploadId ? [v.uploadId] : []);
  const newKey = v.uploadId ? verified.get(v.uploadId)?.key : undefined;

  const values = { slug, name: v.name, description: v.description || null, sortOrder: v.sortOrder };
  let oldKey: string | null = null;

  if (categoryId) {
    const existing = await repo.getCategoryById(categoryId);
    if (!existing) throw new ServiceError("That category no longer exists.");
    oldKey = newKey ? existing.imageStorageKey : null;
    await repo.updateCategory(categoryId, newKey ? { ...values, imageStorageKey: newKey, imageExternalUrl: null } : values);
  } else {
    await repo.insertCategory({ ...values, imageStorageKey: newKey ?? null, imageExternalUrl: null });
  }
  await withTransaction((tx) => media.markAttached(verified, tx));
  if (oldKey) void media.deleteUnreferencedObjects([oldKey]);
}

export async function deleteCategory(id: string): Promise<void> {
  const n = await repo.countProductsIn(id);
  if (n > 0) throw new ServiceError(`This category still has ${n} ${n === 1 ? "product" : "products"}. Move or delete them first.`);
  const existing = await repo.getCategoryById(id);
  await repo.deleteCategory(id);
  if (existing?.imageStorageKey) void media.deleteUnreferencedObjects([existing.imageStorageKey]);
}

export const defaultAdminPageSize = shopConfig.pageSize + 8;
