/** Upload limits, shared by the browser (to fail fast) and the server (the real gate). */
export const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as const;
export type ImageType = keyof typeof IMAGE_TYPES;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGES_PER_PRODUCT = 10;
/** Browser-side resize target before upload: keeps files well under 1 MB and bucket usage low. */
export const MAX_IMAGE_EDGE = 2400;

export const isImageType = (t: string): t is ImageType => t in IMAGE_TYPES;

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!isImageType(file.type)) return "Use a JPEG, PNG, WebP or AVIF image.";
  if (file.size > MAX_UPLOAD_BYTES) return `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`;
  if (file.size === 0) return "This file is empty.";
  return null;
}
