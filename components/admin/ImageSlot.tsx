"use client";

import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IMAGE_TYPES } from "@/lib/media/rules";
import { cn } from "@/lib/utils/cn";
import { startUpload, UploadError } from "./use-upload";

/** A single image picker (category photo): shows the current image and replaces it after a successful upload. */
export function ImageSlot({
  currentUrl,
  onUploaded,
  purpose = "category",
}: {
  currentUrl: string | null;
  onUploaded: (uploadId: string | undefined) => void;
  purpose?: "product" | "category";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>();

  async function pick(file: File) {
    setError(undefined);
    setProgress(0);
    const local = URL.createObjectURL(file);
    try {
      const { uploadId } = await startUpload(file, purpose, setProgress).promise;
      setPreview(local);
      onUploaded(uploadId);
    } catch (e) {
      URL.revokeObjectURL(local);
      setError(e instanceof UploadError ? e.message : "Upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className={cn("relative h-24 w-32 shrink-0 overflow-hidden rounded-card bg-surface-2", !preview && "grid place-items-center")}>
        {preview ? (
          preview.startsWith("blob:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Category preview" className="h-full w-full object-cover" />
          ) : (
            <Image src={preview} alt="Category preview" fill sizes="128px" className="object-cover" />
          )
        ) : (
          <ImagePlus className="h-6 w-6 text-fg-muted" aria-hidden="true" />
        )}
        {progress !== null && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 font-mono text-sm font-semibold backdrop-blur-sm" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            {progress}%
          </div>
        )}
      </div>
      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()} isLoading={progress !== null}>
          {preview ? "Replace image" : "Choose image"}
        </Button>
        <p className="mt-1.5 text-sm text-fg-muted">Shown on the home page tile.</p>
        {error && <p role="alert" className="mt-1 text-sm font-medium text-danger">{error}</p>}
        <input
          ref={input}
          type="file"
          accept={Object.keys(IMAGE_TYPES).join(",")}
          aria-label="Choose an image to upload"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
