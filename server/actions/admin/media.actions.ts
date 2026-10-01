"use server";

import { fail, type ActionResult } from "@/lib/types/action-result";
import { createUploadSchema } from "@/lib/validators/media";
import { createUpload, type UploadTicket } from "@/server/services/media.service";
import { runAdmin } from "./_run";

/** Step 1 of an image upload: returns a short-lived signed URL the browser sends the file to. */
export async function createUploadUrlAction(input: unknown): Promise<ActionResult<UploadTicket>> {
  const parsed = createUploadSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "That image can't be uploaded.");
  return runAdmin("upload-url", (admin) => createUpload(admin.id, parsed.data));
}
