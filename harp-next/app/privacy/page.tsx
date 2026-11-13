import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { FramedPanel } from "@/components/ui/FramedPanel";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export const metadata = pageMetadata("privacy", "/privacy");

export default function PrivacyPage() {
  const c = getContent(); const p = c.privacy;
  return (
    <section className="container-x pb-20 pt-28 md:pb-32">
      <div className="grid gap-10 md:grid-cols-[minmax(240px,1fr)_2fr] md:gap-20">
        <header className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={p.title} by="words" trigger="mount" delay={0.2} /></h1>
          <p className="mt-6 font-mono text-[11px] uppercase text-mute">Last updated: {p.updated ? formatDate(p.updated) : "[TBD]"}</p>
        </header>
        <div>
          {p.status === "placeholder" && (
            <FramedPanel inset={10} className="mb-10 px-6 py-10 md:px-10">
              <p className="eyebrow mb-3">Legal review required</p>
              <p className="max-w-[52ch] text-[15px] leading-[1.5] text-soft">
                No privacy policy has been written for {c.brand.name}. The reference site&rsquo;s wording was deliberately not reused: a privacy policy is a legal document and must be
                drafted or approved by {c.brand.name}&rsquo;s counsel to match what the site actually collects (contact form, newsletter sign-ups, server logs).
              </p>
            </FramedPanel>
          )}
          {p.paragraphs.map((t, i) => <Reveal key={i} delay={0.04}><p className={`mb-6 max-w-[62ch] text-[16px] leading-[1.6] ${t.startsWith("[TBD]") ? "tbd px-1 text-[#333]" : "text-[#333]"}`}>{t}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}
