import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "HARP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** PLACEHOLDER Open Graph artwork — HARP brand artwork is TBD (the Precept OG image was intentionally not reused). */
export default function OgImage() {
  const name = getContent().brand.wordmark;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ width: 64, height: 8, background: "#c8fa00" }} />
        <div style={{ fontSize: 220, letterSpacing: -14, lineHeight: 0.9, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 24, opacity: 0.5 }}>[Robotics] brand artwork</div>
      </div>
    ),
    size,
  );
}
