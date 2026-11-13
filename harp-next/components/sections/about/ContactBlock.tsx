import { ArrowRight } from "@/components/ui/Icons";
import { EmailLink } from "@/components/ui/HoverLink";
import { DrawLine, Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export function ContactBlock({ c, id = "contact-title" }: { c: { eyebrow: string; title: string; body: string; channels: { label: string; email: string }[] }; id?: string }) {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby={id}>
      <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2 id={id} className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={c.title} by="words" /></h2>
        </div>
        <Reveal><p className="max-w-[34ch] text-[19px] leading-[1.3] md:mt-8">{c.body}</p></Reveal>
      </div>
      <ul className="mt-14">
        {c.channels.map((ch) => (
          <li key={ch.label}>
            <DrawLine className="text-black/15" />
            <div className="flex items-center justify-between py-6">
              <div><p className="mb-2 font-mono text-[11px] uppercase text-mute">{ch.label}</p><EmailLink email={ch.email} className="text-[17px] font-medium" /></div>
              <ArrowRight className="size-5 text-soft" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
