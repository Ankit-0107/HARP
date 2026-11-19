import Link from "next/link";
import { GridDrift } from "@/components/canvas/GridDrift";
import { NewsletterForm } from "./NewsletterForm";
import { WorldClock } from "./WorldClock";
import type { SiteContent } from "@/content/types";

export function Footer({ c }: { c: SiteContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden bg-black text-white">
      <GridDrift className="-z-10" />
      <div className="container-x flex min-h-[640px] flex-col justify-between gap-24 pb-8 pt-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr_1.4fr]">
          <div>
            <h2 className="mb-4 font-mono text-[12px] uppercase text-white/50">Menu</h2>
            <ul className="space-y-1.5 text-[17px]">{c.nav.links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-accent">{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-[12px] uppercase text-white/50">Socials</h2>
            <ul className="space-y-1.5 text-[17px]">
              {c.nav.socials.map((s) => <li key={s.label}>{s.href ? <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{s.label}</a> : <span className="tbd px-1 text-white/70" title="[TBD] profile not verified">[TBD] {s.label}</span>}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-mono text-[12px] uppercase text-white/50">{c.nav.newsletter.label}</h2>
            <NewsletterForm {...c.nav.newsletter} />
          </div>
        </div>

        {/* ── Giant brand wordmark ──
            Container-query sizing: the <div> below is a CSS inline-size
            container, so `cqw` units are relative to *this* element's width
            rather than the viewport. Font advance for "HARP ROBOTICS" in the
            Skywall font = 3.227× the em size (measured from OTF hmtx table),
            so 100 ÷ 3.227 ≈ 30.98 cqw would hit exactly 100% width.
            We use 30.5 cqw to leave a hair of breathing room, clamped so
            it stays legible on tiny screens and doesn't explode on 4K. */}
        <div
          className="pointer-events-none select-none overflow-hidden -translate-y-18 -mb-40"
          aria-hidden
          style={{ containerType: "inline-size" }}
        >
          <p
            className="whitespace-nowrap text-center font-[family-name:var(--font-skywall)] font-normal uppercase leading-[0.82] tracking-[-0.002em] text-white"
            style={{ fontSize: "clamp(3.5rem, 30.5cqw, 36rem)" }}
          >
            HARP ROBOTICS
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-5 font-[family-name:var(--font-space-mono)] text-[12px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{c.brand.legalLine.replace(/^©\s?\d{4}/, `© ${year}`)}</p>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <WorldClock />
        </div>
      </div>
    </footer>
  );
}
