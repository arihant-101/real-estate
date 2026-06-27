"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FILTER_CLASS =
  "absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center brightness-[1.12] contrast-[1.06] saturate-[1.05]";

const VISIBLE_OPACITY = "opacity-[0.82]";

type HomeHeroBackgroundProps = {
  videoUrl: string;
  posterWebp: string;
  posterJpg: string;
};

export function HomeHeroBackground({
  videoUrl,
  posterWebp,
  posterJpg,
}: HomeHeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const showVideo = () => setVideoReady(true);

    video.addEventListener("canplay", showVideo);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      showVideo();
    }

    video.load();
    void video.play().catch(() => {
      /* Autoplay may be blocked; poster remains visible. */
    });

    return () => video.removeEventListener("canplay", showVideo);
  }, [videoUrl]);

  return (
    <>
      <Image
        src={posterWebp}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={`${FILTER_CLASS} z-0 transition-opacity duration-300 ${videoReady ? "opacity-0" : VISIBLE_OPACITY}`}
        aria-hidden
      />
      <video
        ref={videoRef}
        className={`${FILTER_CLASS} z-[1] transition-opacity duration-300 ${videoReady ? VISIBLE_OPACITY : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={posterJpg}
        aria-hidden
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </>
  );
}
