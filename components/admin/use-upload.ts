"use client";

import imageCompression from "browser-image-compression";
import { MAX_IMAGE_EDGE, validateImageFile } from "@/lib/media/rules";
import { createUploadUrlAction } from "@/server/actions/admin/media.actions";

export class UploadError extends Error {}

export interface UploadResult {
  uploadId: string;
  publicUrl: string;
}

export interface UploadHandle {
  promise: Promise<UploadResult>;
  cancel: () => void;
}

/**
 * Browser → bucket upload with progress:
 *   1. check type/size, 2. shrink to ≤2400px WebP (usually well under 1 MB),
 *   3. ask the server for a signed URL, 4. PUT the file straight to storage.
 * The file never passes through our server.
 */
export function startUpload(file: File, purpose: "product" | "category", onProgress: (percent: number) => void): UploadHandle {
  let xhr: XMLHttpRequest | null = null;
  let cancelled = false;

  const promise = (async (): Promise<UploadResult> => {
    const problem = validateImageFile(file);
    if (problem) throw new UploadError(problem);

    let body: File = file;
    try {
      body = await imageCompression(file, {
        maxWidthOrHeight: MAX_IMAGE_EDGE,
        maxSizeMB: 1.5,
        fileType: "image/webp",
        initialQuality: 0.85,
        useWebWorker: true,
      });
    } catch {
      body = file; // can't resize (odd format): send the original, the server still enforces limits
    }
    const problemAfter = validateImageFile(body);
    if (problemAfter) throw new UploadError(problemAfter);
    if (cancelled) throw new UploadError("Cancelled");

    const ticket = await createUploadUrlAction({ contentType: body.type, size: body.size, purpose });
    if (!ticket.ok) throw new UploadError(ticket.error);
    const { url, headers, uploadId, publicUrl } = ticket.data;

    await new Promise<void>((resolve, reject) => {
      xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr!.status >= 200 && xhr!.status < 300 ? resolve() : reject(new UploadError(`Upload failed (${xhr!.status}). Please try again.`)));
      xhr.onerror = () => reject(new UploadError("Network error. Check your connection and try again."));
      xhr.onabort = () => reject(new UploadError("Cancelled"));
      xhr.send(body);
    });
    onProgress(100);
    return { uploadId, publicUrl };
  })();

  return {
    promise,
    cancel: () => {
      cancelled = true;
      xhr?.abort();
    },
  };
}
