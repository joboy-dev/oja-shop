"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { IconButton } from "@/components/ui/Button";
import type { ProductImageDTO } from "@/lib/types/catalog";
import { cn } from "@/lib/utils/cn";

/** Swipeable (scroll-snap) gallery with thumbnails on desktop and a full-size lightbox. */
export function ProductGallery({ images, name }: { images: ProductImageDTO[]; name: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  if (images.length === 0) {
    return <div className="aspect-[4/5] rounded-sheet bg-surface-2" role="img" aria-label={`${name} (no photo yet)`} />;
  }

  return (
    <div className="flex gap-4 lg:flex-row-reverse">
      <div className="relative min-w-0 flex-1">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-sheet bg-surface-2"
          role="group"
          aria-roledescription="carousel"
          aria-label={`${name} photos`}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={`Enlarge photo ${i + 1} of ${images.length}`}
              className="relative aspect-[4/5] w-full shrink-0 cursor-zoom-in snap-center focus-visible:rounded-sheet"
            >
              <Image
                src={img.url}
                alt={img.alt || name}
                fill
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between md:flex">
              <IconButton
                label="Previous photo"
                variant="secondary"
                className="pointer-events-auto bg-surface/90 shadow-soft backdrop-blur disabled:opacity-0"
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Next photo"
                variant="secondary"
                className="pointer-events-auto bg-surface/90 shadow-soft backdrop-blur disabled:opacity-0"
                disabled={index === images.length - 1}
                onClick={() => goTo(index + 1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </div>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
              {images.map((img, i) => (
                <span
                  key={img.id}
                  className={cn(
                    "h-1.5 rounded-full bg-surface/80 shadow-soft transition-[width,background-color] duration-300 ease-snap",
                    i === index ? "w-5 bg-surface" : "w-1.5",
                  )}
                />
              ))}
            </div>
          </>
        )}

        <span className="pointer-events-none absolute right-3 top-3 hidden h-9 w-9 place-items-center rounded-full bg-surface/90 text-fg-muted shadow-soft backdrop-blur md:grid">
          <Expand className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      {images.length > 1 && (
        <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex" role="tablist" aria-label="Choose photo">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-control border-2 transition-[border-color,opacity,transform] duration-200 active:scale-95",
                i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent title={name} hideTitle className="max-w-3xl p-3 sm:p-4">
          <div className="relative aspect-[4/5] max-h-[78dvh] w-full overflow-hidden rounded-card bg-surface-2">
            <Image
              src={images[index]?.url ?? images[0].url}
              alt={images[index]?.alt || name}
              fill
              sizes="(min-width: 768px) 700px, 100vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
