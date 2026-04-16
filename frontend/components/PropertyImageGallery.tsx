"use client";

import { useState } from "react";
import Image from "next/image";

type ImageItem = { id: string; url: string; order: number };

export function PropertyImageGallery({
  images,
  title,
}: {
  images: ImageItem[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const displayImages = images?.length ? images : [];
  const primary = displayImages[selected];

  if (displayImages.length === 0) {
    return (
      <div className="relative aspect-[16/10] bg-panel flex items-center justify-center text-muted">
        No images
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-panel">
        <Image
          src={primary.url}
          alt={`${title} — Image ${selected + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1024px"
          priority
          unoptimized
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden
        />
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {displayImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === selected ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
                i === selected ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
