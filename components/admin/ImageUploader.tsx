"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle, GripVertical, ImagePlus, RotateCcw, X } from "lucide-react";
import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IMAGE_TYPES, validateImageFile } from "@/lib/media/rules";
import { cn } from "@/lib/utils/cn";
import { startUpload, UploadError, type UploadHandle } from "./use-upload";

export interface ImageItem {
  key: string;
  uploadId?: string;
  imageId?: string;
  url: string;
  alt: string;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

interface Props {
  items: ImageItem[];
  setItems: Dispatch<SetStateAction<ImageItem[]>>;
  max: number;
  purpose: "product" | "category";
  /** Validation messages by item index (e.g. missing alt text). */
  altErrors?: (string | undefined)[];
}

const accept = Object.keys(IMAGE_TYPES).join(",");

export function ImageUploader({ items, setItems, max, purpose, altErrors = [] }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handles = useRef(new Map<string, UploadHandle>());
  const files = useRef(new Map<string, File>());
  const [dragOver, setDragOver] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const patch = useCallback(
    (key: string, change: Partial<ImageItem>) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...change } : i))),
    [setItems],
  );

  const run = useCallback(
    (key: string, file: File) => {
      files.current.set(key, file);
      patch(key, { status: "uploading", progress: 0, error: undefined });
      const handle = startUpload(file, purpose, (progress) => patch(key, { progress }));
      handles.current.set(key, handle);
      handle.promise
        .then((r) => patch(key, { status: "done", progress: 100, uploadId: r.uploadId }))
        .catch((err) => {
          if (err instanceof UploadError && err.message === "Cancelled") return;
          patch(key, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
        })
        .finally(() => handles.current.delete(key));
    },
    [patch, purpose],
  );

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const incoming = Array.from(list);
      const room = max - items.length;
      if (incoming.length > room) toast.error(room > 0 ? `You can add ${room} more ${room === 1 ? "photo" : "photos"} (limit ${max}).` : `This product already has ${max} photos.`);
      const accepted: ImageItem[] = [];
      for (const file of incoming.slice(0, Math.max(room, 0))) {
        const problem = validateImageFile(file);
        if (problem) {
          toast.error(`${file.name}: ${problem}`);
          continue;
        }
        const key = crypto.randomUUID();
        accepted.push({ key, url: URL.createObjectURL(file), alt: "", status: "uploading", progress: 0 });
        files.current.set(key, file);
      }
      if (accepted.length === 0) return;
      setItems((prev) => [...prev, ...accepted]);
      for (const item of accepted) run(item.key, files.current.get(item.key)!);
    },
    [items.length, max, run, setItems],
  );

  const remove = (key: string) => {
    handles.current.get(key)?.cancel();
    files.current.delete(key);
    setItems((prev) => {
      const gone = prev.find((i) => i.key === key);
      if (gone?.url.startsWith("blob:")) URL.revokeObjectURL(gone.url);
      return prev.filter((i) => i.key !== key);
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    setItems((prev) => arrayMove(prev, prev.findIndex((i) => i.key === e.active.id), prev.findIndex((i) => i.key === e.over!.id)));
  };

  const full = items.length >= max;

  return (
    <div>
      <div
        tabIndex={0}
        role="group"
        aria-label="Add photos: drop files here, press Enter to browse, or paste an image"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onPaste={(e) => e.clipboardData.files.length && addFiles(e.clipboardData.files)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex flex-col items-center rounded-card border-2 border-dashed px-4 py-8 text-center transition-[border-color,background-color] duration-200",
          dragOver ? "border-primary bg-primary-soft" : "border-border-strong bg-surface-2/40",
          full && "pointer-events-none opacity-50",
        )}
      >
        <ImagePlus className="mb-3 h-7 w-7 text-primary" aria-hidden="true" />
        <p className="font-medium">
          Drop photos here or{" "}
          <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-primary underline underline-offset-4">
            browse
          </button>
        </p>
        <p className="mt-1 text-sm text-fg-muted">JPEG, PNG, WebP or AVIF, up to 10 MB each. You can also paste. {items.length}/{max} added.</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={max > 1}
          aria-label="Choose photos to upload"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.key)} strategy={rectSortingStrategy}>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <UploadCard
                  key={item.key}
                  item={item}
                  index={index}
                  sortable={items.length > 1}
                  altError={altErrors[index]}
                  onAlt={(alt) => patch(item.key, { alt })}
                  onRemove={() => remove(item.key)}
                  onRetry={() => files.current.get(item.key) && run(item.key, files.current.get(item.key)!)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function UploadCard({
  item,
  index,
  sortable,
  altError,
  onAlt,
  onRemove,
  onRetry,
}: {
  item: ImageItem;
  index: number;
  sortable: boolean;
  altError?: string;
  onAlt: (alt: string) => void;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: item.key });
  const role = index === 0 ? "Cover" : index === 1 ? "Shown on hover" : null;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("rounded-card border border-border bg-surface p-2.5", isDragging && "relative z-10 shadow-overlay")}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.alt || `Photo ${index + 1}`} className={cn("h-full w-full object-cover", item.status !== "done" && "opacity-60")} />
        {role && <span className="absolute left-2 top-2 rounded-full bg-fg px-2.5 py-1 text-xs font-semibold text-background">{role}</span>}

        {item.status === "uploading" && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8" role="progressbar" aria-label={`Uploading photo ${index + 1}`} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
              <div className="h-full origin-left rounded-full bg-white transition-transform duration-200" style={{ transform: `scaleX(${item.progress / 100})` }} />
            </div>
            <p className="mt-1.5 text-xs font-medium text-white">Uploading {item.progress}%</p>
          </div>
        )}
        {item.status === "error" && (
          <div className="absolute inset-0 grid place-items-center bg-background/80 p-3 text-center backdrop-blur-sm">
            <div>
              <AlertCircle className="mx-auto h-6 w-6 text-danger" aria-hidden="true" />
              <p className="mt-1 text-sm font-medium text-danger">{item.error}</p>
              <button type="button" onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-on-primary">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          </div>
        )}

        <IconButton label={`Remove photo ${index + 1}`} variant="secondary" onClick={onRemove} className="absolute right-2 top-2 h-9 w-9 bg-surface/90 shadow-soft backdrop-blur">
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
        {sortable && (
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`Reorder photo ${index + 1}. Press space, then use arrow keys.`}
            className="absolute bottom-2 right-2 grid h-9 w-9 cursor-grab touch-none place-items-center rounded-full bg-surface/90 shadow-soft backdrop-blur active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="mt-2.5">
        <Input
          aria-label={`Description of photo ${index + 1}`}
          placeholder="Describe the photo"
          value={item.alt}
          invalid={!!altError}
          onChange={(e) => onAlt(e.target.value)}
          className="h-10 text-[0.9375rem]"
        />
        {altError && <p role="alert" className="mt-1 text-sm font-medium text-danger">{altError}</p>}
      </div>
    </li>
  );
}
