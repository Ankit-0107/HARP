import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { BootCurtain } from "@/components/layout/BootCurtain";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { Hero } from "@/components/sections/home/Hero";
import { AboutIntro } from "@/components/sections/home/AboutIntro";
import { ProductSlider } from "@/components/sections/home/ProductSlider";
// CapableIndustries hidden for now; uncomment when ready to use:
// import { CapableIndustries } from "@/components/sections/home/CapableIndustries";
import { Stats } from "@/components/sections/home/Stats";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { ClientsTicker } from "@/components/sections/home/ClientsTicker";
import { NewsroomExpandCards } from "@/components/sections/home/NewsroomExpandCards";

export const metadata = pageMetadata("home", "/");

export default function HomePage() {
  const c = getContent();
  const h = c.home;
  return (
    <>
      <BootCurtain />
      <Hero c={h.hero} />
      <AboutIntro c={h.about} />
      <ProductSlider slides={h.slider} />
      <NewsroomExpandCards eyebrow="Explore" title="Categories" entries={c.newsroom.entries} />
      {/* CapableIndustries hidden for now; uncomment when ready to use:
      <CapableIndustries slides={h.industries} />
      */}
      <Stats c={h.stats} />
      <Testimonials items={h.testimonials} />
      <ClientsTicker label={h.clients.label} names={h.clients.names} />
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
