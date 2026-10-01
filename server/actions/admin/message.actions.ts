"use server";

import { revalidatePath } from "next/cache";
import { fail, type ActionResult } from "@/lib/types/action-result";
import { idSchema } from "@/lib/validators/admin";
import { markMessageRead } from "@/server/services/admin-misc.service";
import { runAdmin } from "./_run";

export async function markMessageReadAction(input: unknown): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return fail("That message can't be updated.");
  return runAdmin("message-read", async () => {
    await markMessageRead(parsed.data.id);
    revalidatePath("/admin/messages");
  });
}
