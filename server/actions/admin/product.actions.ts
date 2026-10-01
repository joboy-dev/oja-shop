"use server";

import { revalidatePath, updateTag } from "next/cache";
import { fail, type ActionResult } from "@/lib/types/action-result";
import { idSchema, saveProductSchema } from "@/lib/validators/admin";
import * as catalog from "@/server/services/admin-catalog.service";
import { runAdmin } from "./_run";

function refresh(slug?: string) {
  updateTag("products");
  if (slug) updateTag(`product:${slug}`);
  revalidatePath("/admin/products");
}

export async function saveProductAction(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = saveProductSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  return runAdmin("save-product", async () => {
    const saved = await catalog.saveProduct(parsed.data.productId, parsed.data.product);
    refresh(saved.slug);
    return saved;
  });
}

export async function deleteProductAction(input: unknown): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return fail("That product can't be deleted.");
  return runAdmin("delete-product", async () => {
    const { slug } = await catalog.deleteProduct(parsed.data.id);
    refresh(slug);
  });
}

export async function setProductActiveAction(input: { id: string; isActive: boolean }): Promise<ActionResult> {
  const parsed = idSchema.safeParse({ id: input.id });
  if (!parsed.success) return fail("That product can't be changed.");
  return runAdmin("toggle-product", async () => {
    const { slug } = await catalog.setProductActive(parsed.data.id, !!input.isActive);
    refresh(slug);
  });
}
