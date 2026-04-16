/**
 * Outlined scrolling taglines (Centrick-style). Copy repeats seamlessly for the loop.
 */
const SEGMENTS = [
  "Lettings grounded in care, not just compliance",
  "Homes that feel settled from the first week",
  "London properties, quietly elevated",
];

/** Space Grotesk (geometric grotesk) + outline; symmetric vertical padding keeps the line box optically centred */
const outlineClass =
  "inline-block whitespace-nowrap py-[0.2em] font-[family-name:var(--font-marquee)] text-[clamp(2.65rem,8.2vw,6rem)] font-bold leading-none tracking-[-0.04em] antialiased text-transparent [-webkit-text-stroke:2.25px_#CBA38C] sm:text-[clamp(2.95rem,9vw,6.85rem)] sm:[-webkit-text-stroke:2.5px_#CBA38C] md:text-[clamp(3.25rem,10vw,7.65rem)] md:[-webkit-text-stroke:2.75px_#CBA38C] lg:text-[clamp(3.6rem,11vw,8.5rem)] lg:[-webkit-text-stroke:3px_#CBA38C]";

export function NeighbourhoodMarquee() {
  return (
    <div className="box-border flex h-[19.5rem] w-full items-stretch overflow-x-hidden overflow-y-hidden bg-surface sm:h-[22rem] md:h-[25rem] lg:h-[27rem]">
      <div className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center overflow-x-hidden overflow-y-hidden px-0 py-4 sm:py-5 md:py-6 lg:py-7">
        {/* translateY must live on a wrapper: animate-city-marquee sets transform: translateX() and overwrites any translate on the same element */}
        <div className="-translate-y-10 md:-translate-y-12 lg:-translate-y-14">
          <div className="flex w-max animate-city-marquee items-center will-change-transform">
            {[0, 1].map((set) => (
              <div
                key={set}
                className="flex shrink-0 items-center gap-x-6 px-4 md:gap-x-10 md:px-8"
              >
                {SEGMENTS.map((text) => (
                  <span
                    key={`${set}-${text}`}
                    className="flex shrink-0 items-center gap-x-6 md:gap-x-10"
                  >
                    <span className={outlineClass}>{text}</span>
                    <span className={`${outlineClass} opacity-90`} aria-hidden>
                      ·
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
