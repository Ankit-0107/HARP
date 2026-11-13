import Link from "next/link";
import { Img } from "@/components/media/Img";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import { RevealMask } from "@/components/ui/Reveal";
import type { Capability } from "@/content/types";

/** Full-bleed capability row (image + gradient + label). Image zooms slowly on hover (A8). */
export function CapabilityRow({ item }: { item: Capability }) {
  return (
    <Link href={`/capabilities/${item.slug}`} className="group relative block h-[72svh] min-h-[420px] overflow-hidden bg-black text-white md:h-[80svh]">
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-expo group-hover:[@media(hover:hover)]:scale-[1.04]"><Img assetId={item.assetId} alt="" tone="dark" sizes="100vw" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="container-x absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 md:pb-8">
        <div>
          <RevealMask className="mb-2"><p className="font-mono text-[11px] uppercase text-white/70">{item.index} — {item.tag}</p></RevealMask>
          <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] font-medium tracking-[-0.04em]"><SplitText text={item.title} by="words" /></h2>
        </div>
        <ArrowUpRight className="size-6 -translate-x-2 translate-y-2 opacity-0 transition-all duration-500 ease-expo group-hover:[@media(hover:hover)]:translate-x-0 group-hover:[@media(hover:hover)]:translate-y-0 group-hover:[@media(hover:hover)]:opacity-100" />
      </div>
    </Link>
  );
}
