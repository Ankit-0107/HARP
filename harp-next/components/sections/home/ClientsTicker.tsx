import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";
import { getAsset, isReferenceMode } from "@/lib/assets";

/** A15 — client logo ticker. Reference mode shows the 4 recovered template logos; HARP mode shows explicit [TBD] tiles. */
export function ClientsTicker({ label, names }: { label: string; names: string[] }) {
  return (
    <section aria-label={label} className="container-x py-4">
      <div className="rounded-sm bg-surface py-10">
        <Marquee duration={36} gap="5rem" label={label}>
          {names.map((nm, k) => {
            const asset = nm.startsWith("client-logo-") && isReferenceMode() ? getAsset(nm) : null;
            return asset?.local
              ? <Image key={`${nm}-${k}`} src={asset.local} alt="" width={167} height={73} className="h-12 w-auto shrink-0 opacity-80" data-asset-id={nm} />
              : <span key={`${nm}-${k}`} className="tbd grid h-12 w-40 shrink-0 place-items-center font-mono text-[11px] uppercase text-soft">{nm.startsWith("client-logo-") ? "[TBD] Client logo" : nm}</span>;
          })}
        </Marquee>
      </div>
    </section>
  );
}
