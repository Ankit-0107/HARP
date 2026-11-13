"use client";
import { useEffect, useRef, useState } from "react";
import { resolveMedia } from "@/lib/assets";
import { Img } from "./Img";

/** A17 — autoplay/loop/muted/inline video with poster. Pauses for reduced-motion users and when off-screen. If the file is unavailable an explicit placeholder is shown. */
export function HeroVideo({ videoId, posterId, className }: { videoId: string; posterId?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const video = resolveMedia(videoId);
  const poster = posterId ? resolveMedia(posterId) : { src: null };
  const [hasVideo, setHasVideo] = useState(Boolean(video.src));

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [hasVideo]);

  if (video.src) {
    return (
      <video
        ref={ref}
        className={className}
        src={video.src}
        poster={poster.src ?? undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        data-asset-id={videoId}
      />
    );
  }

  return (
    <div className={className}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster.src ?? undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        data-asset-id={videoId}
        onLoadedData={() => setHasVideo(true)}
      >
        <source src="/assets/harp/home-hero-video.mp4" type="video/mp4" />
        <source src="/assets/harp/hero.mp4" type="video/mp4" />
        <source src="/assets/harp/hero-video.mp4" type="video/mp4" />
        <source src="/assets/harp/home-hero-video.webm" type="video/webm" />
      </video>
      {!hasVideo && (
        <div className="absolute inset-0">
          <Img assetId={posterId ?? videoId} alt="" tone="dark" priority />
          <p className="absolute left-3 top-24 font-mono text-[10px] uppercase text-white/50">
            {video.mode === "harp" ? "HARP hero video slot — [TBD]" : "Original hero video unavailable"} · {videoId}
          </p>
        </div>
      )}
    </div>
  );
}
