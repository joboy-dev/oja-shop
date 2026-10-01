import "server-only";
import { randomUUID } from "node:crypto";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, isImageType } from "@/lib/media/rules";
import type { DbExecutor } from "@/server/db/client";
import * as uploadRepo from "@/server/repositories/upload.repo";
import { createPresignedPut, deleteObject, headObject, publicUrl } from "@/server/storage/object-storage";
import { ServiceError } from "./errors";

export interface UploadTicket {
  uploadId: string;
  /** Where the browser sends the file, with the method and headers it must use. */
  url: string;
  method: "PUT";
  headers: Record<string, string>;
  publicUrl: string;
}

/**
 * Step 1 of an upload: reserve a server-chosen key and hand the browser a short-lived signed URL.
 * The file itself goes browser → bucket and never passes through our server.
 */
export async function createUpload(
  userId: string,
  input: { contentType: string; size: number; purpose: "product" | "category" },
): Promise<UploadTicket> {
  if (!isImageType(input.contentType)) throw new ServiceError("Use a JPEG, PNG, WebP or AVIF image.");
  if (input.size > MAX_UPLOAD_BYTES) throw new ServiceError("That image is too large.");

  const now = new Date();
  // The key is ours, never the user's filename: no path tricks, no collisions.
  const key = `${input.purpose}s/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${IMAGE_TYPES[input.contentType]}`;

  const signed = await createPresignedPut(key, input.contentType, 120);
  const row = await uploadRepo.insertUpload({
    storageKey: key,
    contentType: input.contentType,
    purpose: input.purpose,
    status: "pending",
    uploadedBy: userId,
  });
  return { uploadId: row.id, url: signed.url, method: signed.method, headers: signed.headers, publicUrl: publicUrl(key) };
}

export interface VerifiedUpload {
  id: string;
  key: string;
  size: number;
}

/**
 * Step 2, before saving a product or category: confirm each referenced file really arrived,
 * is an image, and is within the size limit. A signed URL cannot cap size, so this check is the real gate.
 */
export async function verifyUploads(ids: string[]): Promise<Map<string, VerifiedUpload>> {
  const rows = await uploadRepo.getUploadsByIds(ids);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out = new Map<string, VerifiedUpload>();

  for (const id of ids) {
    const row = byId.get(id);
    if (!row) throw new ServiceError("One of the photos expired. Please upload it again.");
    if (row.status === "attached") throw new ServiceError("That photo is already in use. Please upload it again.");
    const head = await headObject(row.storageKey);
    if (!head) throw new ServiceError("A photo didn't finish uploading. Please upload it again.");
    if (head.size > MAX_UPLOAD_BYTES || !isImageType(head.contentType)) {
      await deleteObject(row.storageKey).catch(() => undefined);
      await uploadRepo.deleteUploadsByKeys([row.storageKey]);
      throw new ServiceError("A photo was too large or not an image, so it was removed. Please upload a different one.");
    }
    out.set(id, { id, key: row.storageKey, size: head.size });
  }
  return out;
}

export function markAttached(verified: Map<string, VerifiedUpload>, executor: DbExecutor) {
  return uploadRepo.markAttached(
    [...verified.keys()],
    new Map([...verified].map(([id, v]) => [id, v.size])),
    executor,
  );
}

/**
 * Delete bucket objects nobody points at any more. Objects still referenced (for example by a past
 * order's item snapshot, so order history keeps its pictures) are kept. Never throws.
 */
export async function deleteUnreferencedObjects(keys: string[]): Promise<void> {
  const deletable: string[] = [];
  for (const key of keys) {
    try {
      if (await uploadRepo.isKeyReferenced(key)) continue;
      await deleteObject(key);
      deletable.push(key);
    } catch (err) {
      console.error("[media] could not delete", key, err);
    }
  }
  await uploadRepo.deleteUploadsByKeys(deletable).catch((e) => console.error("[media] ledger cleanup", e));
}
