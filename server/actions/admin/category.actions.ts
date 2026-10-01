"use server";

import { revalidatePath, updateTag } from "next/cache";
import { fail, type ActionResult } from "@/lib/types/action-result";
import { idSchema, saveCategorySchema } from "@/lib/validators/admin";
import * as catalog from "@/server/services/admin-catalog.service";
import { runAdmin } from "./_run";

const refresh = () => {
  updateTag("categories");
  updateTag("products");
  revalidatePath("/admin/categories");
};

export async function saveCategoryAction(input: unknown): Promise<ActionResult> {
  const parsed = saveCategorySchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  return runAdmin("save-category", async () => {
    await catalog.saveCategory(parsed.data.categoryId, parsed.data.category);
    refresh();
  });
}

export async function deleteCategoryAction(input: unknown): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return fail("That category can't be deleted.");
  return runAdmin("delete-category", async () => {
    await catalog.deleteCategory(parsed.data.id);
    refresh();
  });
}
