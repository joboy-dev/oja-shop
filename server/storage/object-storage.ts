import "server-only";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/server/config/env";

/**
 * Neon Object Storage (S3-compatible). Only this file knows the provider;
 * swapping to S3/B2/MinIO is an env change. Path-style addressing and
 * on-demand checksums are required by non-AWS S3 implementations.
 */
const client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

/** Public URL of an object in the public_read bucket. Keys are stored in the DB, never full URLs. */
export function publicUrl(key: string): string {
  return `${env.STORAGE_PUBLIC_URL}/${env.STORAGE_BUCKET}/${key}`;
}

export async function createPresignedPut(key: string, contentType: string, expiresIn = 120) {
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn },
  );
  return { url, method: "PUT" as const, headers: { "Content-Type": contentType } };
}

export async function putObject(key: string, body: Uint8Array | Buffer, contentType: string) {
  await client.send(
    new PutObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key, Body: body, ContentType: contentType }),
  );
}

export async function headObject(key: string): Promise<{ size: number; contentType: string } | null> {
  try {
    const res = await client.send(new HeadObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key }));
    return { size: res.ContentLength ?? 0, contentType: res.ContentType ?? "" };
  } catch (err) {
    const status = (err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404) return null;
    throw err;
  }
}

export async function deleteObject(key: string) {
  await client.send(new DeleteObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key }));
}
