import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { GridDrift } from "@/components/canvas/GridDrift";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { DrawLine, Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { FramedPanel } from "@/components/ui/FramedPanel";
import { ArrowDown, ArrowRight } from "@/components/ui/Icons";

type Params = { slug: string };
export const dynamicParams = false;
export function generateStaticParams(): Params[] { return Object.keys(getContent().capabilityDetails).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params; const c = getContent(); const d = c.capabilityDetails[slug];
  if (!d) return {};
  return { title: `${d.title} — ${c.brand.name}`, description: d.status === "published" ? d.intro : `${d.title} — page content pending.`,
    alternates: { canonical: `/capabilities/${slug}` }, robots: d.status === "placeholder" || c.source === "reference" ? { index: false, follow: false } : undefined };
}

export default async function CapabilityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params; const c = getContent(); const d = c.capabilityDetails[slug];
  if (!d) notFound();
  const item = c.capabilities.items.find((i) => i.slug === slug)!;
  const others = c.capabilities.items.filter((i) => i.slug !== slug);

  return (
    <>
      <section className="container-x pb-10 pt-28 md:pb-16">
        <p className="eyebrow mb-4">{item.index} — {item.tag}</p>
        <h1 className="h-display text-[clamp(2.75rem,8vw,8rem)] font-light"><SplitText text={d.title} trigger="mount" delay={0.2} stagger={0.035} /></h1>
        {d.status === "published" && <Reveal delay={0.5}><p className="mt-8 max-w-[44ch] text-[19px] leading-[1.3]">{d.intro}</p></Reveal>}
      </section>
      <section className="container-x pb-6" aria-hidden><ParallaxImage assetId={item.assetId} className="h-[64svh] min-h-[320px]" /></section>

      {d.status === "placeholder" ? (
        <section className="container-x py-16 md:py-24" aria-labelledby="pending">
          <FramedPanel inset={8} className="px-6 py-16 md:px-[10%] md:py-24">
            <p className="eyebrow mb-5">Content pending</p>
            <h2 id="pending" className="max-w-[22ch] text-balance text-[clamp(1.75rem,3vw,2.5rem)] font-light tracking-[-0.04em]">This capability page is a designed placeholder.</h2>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-[1.5] text-soft">
              No description, services or technical claims have been written or verified for this page yet. The layout below shows where each block will appear once
              {c.source === "harp" ? " HARP supplies and approves the content." : " content is supplied (the original export did not include this page)."}
            </p>
            <div className="mt-10 grid gap-2 md:grid-cols-3">
              {["Overview", "Services (up to 6)", "Systems (up to 4)"].map((b) => (
                <div key={b} className="tbd rounded-sm border border-dashed border-black/25 p-5"><p className="font-mono text-[11px] uppercase">[TBD]</p><p className="mt-6 text-[15px]">{b}</p></div>
              ))}
            </div>
          </FramedPanel>
        </section>
      ) : (
        <>
          <section className="container-x py-16 md:py-24" aria-labelledby="overview">
            <DrawLine className="text-black/15" />
            <div className="grid gap-8 pt-10 md:grid-cols-[1fr_2fr]">
              <h2 id="overview" className="text-[clamp(1.5rem,2.4vw,2rem)] font-light tracking-[-0.04em]">Overview</h2>
              <Reveal><p className="max-w-[52ch] text-[15px] leading-[1.5] text-[#333]">{d.overview}</p></Reveal>
            </div>
            <h3 className="h-section mt-28 max-w-[18ch] text-balance text-[clamp(2rem,3.8vw,3.5rem)]"><SplitText text={d.heading} by="words" /></h3>
            <ol className="mt-16 grid gap-x-8 md:grid-cols-3">
              {d.services.map((s, i) => (
                <li key={s.title}>
                  <DrawLine className="text-black/15" delay={(i % 3) * 0.06} />
                  <Reveal className="py-6 pb-12"><p className="mb-8 font-mono text-[11px] text-mute">[{String(i + 1).padStart(2, "0")}]</p><h4 className="text-[17px] font-medium tracking-[-0.02em]">{s.title}</h4><p className="mt-2 max-w-[28ch] text-[14px] leading-[1.4] text-soft">{s.body}</p></Reveal>
                </li>
              ))}
            </ol>
          </section>
          <section className="relative isolate grid h-[56svh] min-h-[320px] place-items-center overflow-hidden bg-black text-white" aria-labelledby="systems-title">
            <GridDrift className="-z-10" />
            <h2 id="systems-title" className="flex items-center gap-3 text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium tracking-[-0.03em]"><ArrowDown className="size-6" />{d.systemsLabel}</h2>
          </section>
          <section className="container-x py-12 md:py-20" aria-label="Systems">
            <ol>{d.systems.map((s, i) => (
              <li key={s.title}><DrawLine className="text-black/15" />
                <Reveal className="grid gap-4 py-8 md:grid-cols-[1fr_2fr]"><p className="font-mono text-[11px] text-mute">[{String(i + 1).padStart(2, "0")}]</p>
                  <div><h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-light tracking-[-0.04em]">{s.title}</h3><p className="mt-2 text-[14px] text-soft">{s.body}</p></div></Reveal>
              </li>))}</ol>
          </section>
        </>
      )}

      <nav aria-label="Other capabilities" className="container-x py-10">
        <p className="eyebrow mb-4">More capabilities</p>
        <ul className="grid gap-1 md:grid-cols-3">
          {others.map((o) => (<li key={o.slug}><Link href={`/capabilities/${o.slug}`} className="group flex items-center justify-between rounded-sm bg-surface p-5 hover:bg-surface-2"><span><span className="block font-mono text-[11px] text-mute">{o.index} — {o.tag}</span><span className="mt-2 block text-[17px] font-medium tracking-[-0.02em]">{o.title}</span></span><ArrowRight className="size-5 transition-transform duration-500 ease-expo group-hover:translate-x-1" /></Link></li>))}
        </ul>
      </nav>
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
