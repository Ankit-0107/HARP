import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { Img } from "@/components/media/Img";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ArrowRight } from "@/components/ui/Icons";
import { EmailLink } from "@/components/ui/HoverLink";
import { DrawLine, Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export const metadata = pageMetadata("contact", "/contact");

export default function ContactPage() {
  const c = getContent(); const k = c.contact;
  return (
    <>
      <section className="container-x pb-10 pt-28 md:pb-16" aria-labelledby="contact-title">
        <p className="eyebrow mb-4">{k.eyebrow}</p>
        <div className="grid gap-8 md:grid-cols-2">
          <h1 id="contact-title" className="h-display text-[clamp(3rem,8vw,8rem)] font-light"><SplitText text={k.title} trigger="mount" delay={0.2} /></h1>
          {k.body && <Reveal delay={0.5}><p className="max-w-[34ch] text-[19px] leading-[1.3] md:mt-6">{k.body}</p></Reveal>}
        </div>
      </section>
      <section className="container-x pb-16 md:pb-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div>
            <ul>
              {k.channels.map((ch) => (
                <li key={ch.label}><DrawLine className="text-black/15" />
                  <div className="flex items-center justify-between py-6"><div><p className="mb-2 font-mono text-[11px] uppercase text-mute">{ch.label}</p><EmailLink email={ch.email} className="text-[17px] font-medium" /></div><ArrowRight className="size-5 text-soft" /></div>
                </li>
              ))}
              <li><DrawLine className="text-black/15" />
                <div className="py-6"><p className="mb-2 font-mono text-[11px] uppercase text-mute">{k.hq.label}</p><address className="not-italic text-[17px] font-medium leading-[1.3]">{k.hq.lines.map((l) => <span key={l} className="block">{l}</span>)}</address></div>
              </li>
            </ul>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-sm bg-surface-2"><Img assetId="capability-precision-machining" alt="" sizes="(min-width:810px) 40vw, 90vw" /></div>
          </div>
          <div className="rounded-sm bg-surface p-6 md:p-10">
            <h2 className="mb-6 text-[clamp(1.5rem,2.4vw,2rem)] font-light tracking-[-0.04em]">{k.form.title}</h2>
            <ContactForm labels={k.form} />
          </div>
        </div>
      </section>
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
