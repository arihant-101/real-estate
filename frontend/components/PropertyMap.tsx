"use client";

/**
 * Renders a map section for a property address.
 * If NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY is set, shows an embedded Google Map.
 * Otherwise shows a "View on map" link that opens Google Maps in a new tab.
 */
export function PropertyMap({ address }: { address: string }) {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const embedKey = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY : undefined;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-panel/50">
      <h2 className="border-b border-white/10 px-6 py-4 text-lg font-semibold text-white">
        Location
      </h2>
      <div className="relative aspect-[16/9] w-full min-h-[200px] bg-panel">
        {embedKey ? (
          <iframe
            title="Property location map"
            src={`https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodedAddress}`}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-panel/90 p-6 text-center transition hover:bg-panel/80"
          >
            <span className="text-4xl" aria-hidden>
              📍
            </span>
            <span className="text-sm font-medium text-white">
              View on Google Maps
            </span>
            <span className="max-w-md truncate text-xs text-muted">
              {address}
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
