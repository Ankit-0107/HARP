import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { CapabilityRow } from "@/components/sections/capabilities/CapabilityRow";
import { IndustriesIndex } from "@/components/sections/capabilities/IndustriesIndex";

export const metadata = pageMetadata("capabilities", "/capabilities");

export default function CapabilitiesPage() {
  const c = getContent();
  const k = c.capabilities;
  return (
    <>
      <section className="container-x flex min-h-[70svh] flex-col justify-between pb-10 pt-28">
        <Reveal delay={0.2} className="md:ml-auto"><p className="max-w-[40ch] text-[17px] font-medium leading-[1.3]">{k.intro}</p></Reveal>
        <div>
          <p className="eyebrow mb-4">{k.eyebrow}</p>
          <h1 className="h-display text-[clamp(3rem,9vw,9rem)] font-light"><SplitText text={k.title} trigger="mount" delay={0.2} stagger={0.035} /></h1>
        </div>
      </section>
      <section aria-label="Capabilities" className="grid gap-1">{k.items.map((it) => <CapabilityRow key={it.index} item={it} />)}</section>
      <IndustriesIndex c={k.industries} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
