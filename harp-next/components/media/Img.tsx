import Image from "next/image";
import { resolveMedia } from "@/lib/assets";
import { cn } from "@/lib/cn";

interface Props { assetId?: string; src?: string; alt: string; className?: string; sizes?: string; priority?: boolean; tone?: "light" | "dark" }

/**
 * Renders a manifest image SLOT or direct image src. Works in server and client components.
 *  • src or file available → next/image
 *  • otherwise            → an EXPLICIT placeholder naming the slot (never a silent stand-in)
 * The parent must be `relative` and sized.
 */
export function Img({ assetId, src: directSrc, alt, className, sizes = "100vw", priority, tone = "light" }: Props) {
  if (directSrc) {
    return <Image src={directSrc} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }
  const resolved = assetId ? resolveMedia(assetId) : { src: null, mode: "harp" as const };
  if (resolved.src) {
    return <Image src={resolved.src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} data-asset-id={assetId} data-asset-status="available" />;
  }
  return <AssetPlaceholder assetId={assetId ?? "unspecified"} alt={alt} className={className} tone={tone} mode={resolved.mode} />;
}

export function AssetPlaceholder({ assetId, alt, className, tone = "light", mode }: Omit<Props, "sizes" | "priority"> & { mode: "reference" | "harp" }) {
  const dark = tone === "dark";
  return (
    <div role="img" aria-label={`${alt} (image not yet available)`} data-asset-id={assetId} data-asset-status="missing"
      className={cn("@container absolute inset-0 flex items-end overflow-hidden p-3", dark ? "bg-[#161616] text-white/50" : "bg-surface-2 text-black/45", className)}
      style={{ backgroundImage: `repeating-linear-gradient(135deg, ${dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"} 0 1px, transparent 1px 14px)` }}>
      <span className="hidden font-mono text-[10px] uppercase leading-tight tracking-wide @min-[140px]:block">
        {mode === "harp" ? "HARP image slot — [TBD]" : "Original image unavailable"}<br />{assetId}
      </span>
    </div>
  );
}
