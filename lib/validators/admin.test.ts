import { describe, expect, it } from "vitest";
import { productFormSchema } from "./admin";

const valid = {
  name: "Adire Throw",
  slug: "",
  categoryId: "3f1c9d2e-1b7a-4c1e-9d3b-2a5f6e7c8d90",
  shortDescription: "Hand-painted resist on indigo cotton.",
  description: "A long enough description of the throw.",
  price: "48,000",
  compareAtPrice: "",
  stock: "14",
  isActive: true,
  isFeatured: false,
  materials: "",
  care: "",
  images: [{ uploadId: "3f1c9d2e-1b7a-4c1e-9d3b-2a5f6e7c8d91", alt: "Indigo cloth" }],
};

describe("productFormSchema", () => {
  it("converts naira text to kobo and stock to a number", () => {
    const r = productFormSchema.parse(valid);
    expect(r.price).toBe(4_800_000);
    expect(r.compareAtPrice).toBeNull();
    expect(r.stock).toBe(14);
  });
  it("requires the 'was' price to be higher", () => {
    const r = productFormSchema.safeParse({ ...valid, compareAtPrice: "40000" });
    expect(r.success).toBe(false);
    expect(!r.success && r.error.issues[0].path).toEqual(["compareAtPrice"]);
  });
  it("rejects zero price, bad stock and unusable images", () => {
    expect(productFormSchema.safeParse({ ...valid, price: "0" }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...valid, stock: "-1" }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...valid, stock: "1.5" }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...valid, images: [{ alt: "x" }] }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...valid, images: [{ uploadId: valid.images[0].uploadId, alt: "" }] }).success).toBe(false);
  });
  it("caps the number of photos", () => {
    const many = Array.from({ length: 11 }, () => ({ uploadId: valid.images[0].uploadId, alt: "Photo" }));
    expect(productFormSchema.safeParse({ ...valid, images: many }).success).toBe(false);
  });
});
