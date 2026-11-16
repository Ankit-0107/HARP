import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { AboutHeader } from "@/components/sections/about/AboutHeader";
import { Timeline } from "@/components/sections/about/Timeline";
import { Leadership } from "@/components/sections/about/Leadership";
// Locations hidden for now; uncomment when ready to use:
// import { Locations } from "@/components/sections/about/Locations";
import { ContactBlock } from "@/components/sections/about/ContactBlock";

export const metadata = pageMetadata("about", "/about");

export default function AboutPage() {
  const c = getContent();
  return (
    <>
      <AboutHeader c={c.about.header} />
      <Timeline c={c.about.timeline} />
      <Leadership c={c.about.leadership} />
      {/* Locations hidden for now; uncomment when ready to use:
      <Locations eyebrow={c.about.locations.eyebrow} locations={c.about.locations.locations} />
      */}
      <ContactBlock c={c.about.contact} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
