"use client";

import { useCallback, useEffect, useState } from "react";

type Block =
  | { kind: "field"; label: string; value: string }
  | { kind: "prose"; text: string };

/** Split wizard-built descriptions (paragraphs joined with \\n\\n) into labelled fields vs free prose. */
export function parseRepairDescription(description: string): Block[] {
  const chunks = description.split(/\n\n+/).map((c) => c.trim()).filter(Boolean);
  const blocks: Block[] = [];
  for (const chunk of chunks) {
    const m = /^([^:\n]{1,200}):\s*([\s\S]*)$/.exec(chunk);
    if (m) {
      blocks.push({ kind: "field", label: m[1].trim(), value: m[2].trim() || "—" });
    } else {
      blocks.push({ kind: "prose", text: chunk });
    }
  }
  return blocks;
}

function suggestedPhotoFilename(index: number, src: string): string {
  if (/^https?:\/\//i.test(src)) {
    try {
      const u = new URL(src);
      const last = decodeURIComponent(u.pathname.split("/").pop() || "");
      if (/\.(jpe?g|png|webp|gif)$/i.test(last)) return last;
    } catch {
      /* ignore */
    }
    return `repair-photo-${index + 1}.jpg`;
  }
  const m = /^data:image\/([^;]+)/i.exec(src);
  const sub = (m?.[1] || "jpeg").toLowerCase();
  const ext = sub === "jpeg" ? "jpg" : sub;
  return `repair-photo-${index + 1}.${ext}`;
}

export function RepairReportDetails({
  description,
  photoUrls,
  className = "",
}: {
  description: string;
  photoUrls: string[];
  /** Extra classes for the outer panel */
  className?: string;
}) {
  const blocks = parseRepairDescription(description);
  const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox]);

  return (
    <div className={`space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 ${className}`}>
      <div className="space-y-3">
        {blocks.map((b, i) =>
          b.kind === "field" ? (
            <div
              key={i}
              className="grid gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4"
            >
              <div className="text-xs font-medium uppercase tracking-wide text-muted">{b.label}</div>
              <div className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap break-words">{b.value}</div>
            </div>
          ) : (
            <div
              key={i}
              className="rounded-lg border border-white/5 bg-black/25 p-3 text-sm leading-relaxed text-white/90 whitespace-pre-wrap break-words"
            >
              {b.text}
            </div>
          )
        )}
      </div>

      {photoUrls.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Tenant photos</p>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photoUrls.map((src, i) => {
              const filename = suggestedPhotoFilename(i, src);
              return (
                <li key={i} className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/20">
                  <button
                    type="button"
                    onClick={() => setLightbox({ src, index: i })}
                    className="group relative block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Tenant photo ${i + 1} — tap to view full size`}
                      className="aspect-video w-full object-cover transition group-hover:opacity-90"
                    />
                    <span className="sr-only">View full picture {i + 1}</span>
                  </button>
                  <div className="flex flex-col gap-1 border-t border-white/10 p-2">
                    <button
                      type="button"
                      onClick={() => setLightbox({ src, index: i })}
                      className="rounded-md bg-white/10 px-2 py-1.5 text-center text-xs font-medium text-white hover:bg-white/15"
                    >
                      View full picture
                    </button>
                    <a
                      href={src}
                      download={filename}
                      className="rounded-md border border-white/15 px-2 py-1.5 text-center text-xs font-medium text-primary hover:bg-white/5"
                    >
                      Download
                    </a>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[10px] text-muted underline hover:text-white"
                    >
                      Open in new tab
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex flex-col bg-black/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size photo"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <p className="text-sm text-white">
              Photo {lightbox.index + 1} of {photoUrls.length}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={lightbox.src}
                download={suggestedPhotoFilename(lightbox.index, lightbox.src)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Download
              </a>
              <a
                href={lightbox.src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/20 px-3 py-2 text-sm text-muted hover:bg-white/10 hover:text-white"
              >
                New tab
              </a>
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-black hover:bg-primary-light"
              >
                Close
              </button>
            </div>
          </div>
          <button
            type="button"
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4"
            onClick={closeLightbox}
            aria-label="Close preview"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt=""
              className="max-h-[calc(100vh-8rem)] max-w-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </button>
          <p className="shrink-0 px-4 pb-4 text-center text-xs text-muted">
            Click outside the image or press Escape to close
          </p>
        </div>
      )}
    </div>
  );
}
