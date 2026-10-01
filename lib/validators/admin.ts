import { z } from "zod";
import { MAX_IMAGES_PER_PRODUCT } from "@/lib/media/rules";
import { orderStatuses } from "@/lib/config/shop";
import { nairaToKobo } from "@/lib/utils/money";
import { slugify } from "@/lib/utils/slug";

const nairaField = (name: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter the ${name}`)
    .transform((v, ctx) => {
      const kobo = nairaToKobo(v);
      if (kobo === null) {
        ctx.addIssue({ code: "custom", message: `Enter a valid ${name}` });
        return z.NEVER;
      }
      return kobo;
    });

const optionalNaira = z
  .string()
  .trim()
  .transform((v, ctx) => {
    if (v === "") return null;
    const kobo = nairaToKobo(v);
    if (kobo === null) {
      ctx.addIssue({ code: "custom", message: "Enter a valid price" });
      return z.NEVER;
    }
    return kobo;
  });

export const productImageInputSchema = z
  .object({
    /** An upload made in this session (not yet attached). */
    uploadId: z.uuid().optional(),
    /** An image already saved on this product. */
    imageId: z.uuid().optional(),
    alt: z.string().trim().min(2, "Describe the photo for screen readers").max(200),
  })
  .refine((i) => !!i.uploadId !== !!i.imageId, "Each image needs exactly one source");

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a product name").max(120),
    slug: z
      .string()
      .trim()
      .max(80)
      .transform((v) => slugify(v))
      .optional(),
    categoryId: z.uuid("Choose a category"),
    shortDescription: z.string().trim().min(10, "Write a one-line summary (at least 10 characters)").max(200, "Keep the summary under 200 characters"),
    description: z.string().trim().min(10, "Describe the product").max(4000),
    price: nairaField("price"),
    compareAtPrice: optionalNaira,
    stock: z.string().trim().regex(/^\d{1,6}$/, "Enter a whole number, 0 or more").transform(Number),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    materials: z.string().trim().max(300).optional(),
    care: z.string().trim().max(500).optional(),
    images: z.array(productImageInputSchema).max(MAX_IMAGES_PER_PRODUCT, `Up to ${MAX_IMAGES_PER_PRODUCT} photos`),
  })
  .superRefine((v, ctx) => {
    if (v.price <= 0) ctx.addIssue({ code: "custom", path: ["price"], message: "Price must be more than zero" });
    if (v.compareAtPrice !== null && v.compareAtPrice <= v.price)
      ctx.addIssue({ code: "custom", path: ["compareAtPrice"], message: "The 'was' price must be higher than the price" });
  });

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

export const saveProductSchema = z.object({ productId: z.uuid().optional(), product: productFormSchema });

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Enter a category name").max(60),
  slug: z.string().trim().max(60).transform((v) => slugify(v)).optional(),
  description: z.string().trim().max(300).optional(),
  uploadId: z.uuid().optional(),
  sortOrder: z.string().trim().regex(/^\d{1,4}$/, "Use a whole number").transform(Number),
});
export type CategoryFormInput = z.input<typeof categoryFormSchema>;
export type CategoryFormValues = z.output<typeof categoryFormSchema>;
export const saveCategorySchema = z.object({ categoryId: z.uuid().optional(), category: categoryFormSchema });

export const orderStatusChangeSchema = z.object({
  orderNumber: z.string().min(4).max(20),
  status: z.enum(orderStatuses),
  note: z.string().trim().max(300).optional(),
});

export const orderNumberSchema = z.object({ orderNumber: z.string().min(4).max(20) });
export const idSchema = z.object({ id: z.uuid() });
