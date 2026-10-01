import { z } from "zod";
import { MAX_UPLOAD_BYTES, isImageType } from "@/lib/media/rules";

export const createUploadSchema = z.object({
  contentType: z.string().refine(isImageType, "Use a JPEG, PNG, WebP or AVIF image."),
  size: z.number().int().min(1).max(MAX_UPLOAD_BYTES, "That image is too large."),
  purpose: z.enum(["product", "category"]),
});
