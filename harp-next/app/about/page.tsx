import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { AboutHeader } from "@/components/sections/about/AboutHeader";
import { Timeline } from "@/components/sections/about/Timeline";
import { Leadership } from "@/components/sections/about/Leadership";
import { Locations } from "@/components/sections/about/Locations";
import { ContactBlock } from "@/components/sections/about/ContactBlock";

export const metadata = pageMetadata("about", "/about");

export default function AboutPage() {
  const c = getContent();
  return (
    <>
      <AboutHeader c={c.about.header} />
      <Timeline c={c.about.timeline} />
      <Leadership c={c.about.leadership} />
      <Locations eyebrow={c.about.locations.eyebrow} locations={c.about.locations.locations} />
      <ContactBlock c={c.about.contact} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
